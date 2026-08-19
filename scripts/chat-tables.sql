-- ClearFin Ask — assistant storage and usage funnel.
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Funnel: 10 free prompts → email required → 10 more → hard stop at 20,
-- after which the visitor is told to contact info@clearfin.ca.

-- ── Identity and funnel state ────────────────────────────────────────────
-- NOT subject to the 7-day purge: the 20-prompt allowance must not reset
-- when a visitor's message history is deleted.
create table if not exists public.chat_sessions (
  client_id    uuid primary key,
  email        text,
  email_at     timestamptz,
  prompt_count integer not null default 0,
  ip_hash      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint chat_sessions_email_has_at check (email is null or position('@' in email) > 1)
);

create index if not exists chat_sessions_email_idx on public.chat_sessions (email)
  where email is not null;

comment on table public.chat_sessions is
  'One row per browser using ClearFin Ask. prompt_count is a lifetime allowance (max 20) and must never be reset by the message purge.';

-- ── Conversation log — 7 day retention ───────────────────────────────────
create table if not exists public.chat_messages (
  id         bigserial primary key,
  client_id  uuid not null references public.chat_sessions(client_id) on delete cascade,
  email      text,
  role       text not null check (role in ('user','assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_created_at_idx on public.chat_messages (created_at);
create index if not exists chat_messages_client_idx on public.chat_messages (client_id, created_at);

comment on table public.chat_messages is
  'Prompts and assistant replies. Deleted after 7 days by the purge_chat_messages cron job.';

-- ── Global daily spend guard ─────────────────────────────────────────────
create table if not exists public.chat_daily_usage (
  day    date primary key,
  tokens bigint not null default 0
);

-- ── Atomic helpers ───────────────────────────────────────────────────────

-- Create the session if new; always return its current state.
create or replace function public.chat_touch_session(p_client_id uuid, p_ip_hash text)
returns table (prompt_count integer, email text)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.chat_sessions (client_id, ip_hash)
  values (p_client_id, p_ip_hash)
  on conflict (client_id) do update
    set updated_at = now(),
        ip_hash = coalesce(public.chat_sessions.ip_hash, excluded.ip_hash);

  return query
    select s.prompt_count, s.email from public.chat_sessions s where s.client_id = p_client_id;
end;
$$;

-- Count one answered prompt and add its token cost to the daily total.
create or replace function public.chat_record_prompt(p_client_id uuid, p_tokens integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.chat_sessions
     set prompt_count = prompt_count + 1, updated_at = now()
   where client_id = p_client_id
  returning prompt_count into v_count;

  insert into public.chat_daily_usage (day, tokens)
  values (current_date, greatest(p_tokens, 0))
  on conflict (day) do update
    set tokens = public.chat_daily_usage.tokens + greatest(excluded.tokens, 0);

  return v_count;
end;
$$;

-- Attach an email to the session and backfill it onto that visitor's history,
-- so earlier prompts can be traced to the person who asked them.
create or replace function public.chat_set_email(p_client_id uuid, p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chat_sessions
     set email = p_email, email_at = now(), updated_at = now()
   where client_id = p_client_id;

  update public.chat_messages
     set email = p_email
   where client_id = p_client_id and email is null;
end;
$$;

-- ── Lock down ────────────────────────────────────────────────────────────
-- Written only by the server using the service-role key, which bypasses RLS.
-- Enabling RLS with no policies means the public anon key cannot read them.
alter table public.chat_sessions    enable row level security;
alter table public.chat_messages    enable row level security;
alter table public.chat_daily_usage enable row level security;

-- ── 7-day retention ──────────────────────────────────────────────────────
create or replace function public.purge_chat_messages()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.chat_messages where created_at < now() - interval '7 days';
  delete from public.chat_daily_usage where day < current_date - interval '30 days';
$$;

-- Schedule it daily at 03:15 UTC. pg_cron must be enabled on the project.
create extension if not exists pg_cron;

do $$
begin
  perform cron.unschedule('purge-chat-messages');
exception when others then
  null; -- job did not exist yet
end;
$$;

select cron.schedule('purge-chat-messages', '15 3 * * *', 'select public.purge_chat_messages()');
