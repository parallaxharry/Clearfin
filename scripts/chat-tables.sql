-- ClearFin card assistant — supporting tables.
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Until this is run, the chat endpoint falls back to per-instance in-memory
-- rate limiting, which is weaker across serverless instances but still works.

-- ── Rate limiting and spend cap ──────────────────────────────────────────
create table if not exists public.chat_usage (
  day       date    not null,
  ip_hash   text    not null,
  messages  integer not null default 0,
  tokens    integer not null default 0,
  primary key (day, ip_hash)
);

comment on table public.chat_usage is
  'Per-day chat counters. ip_hash is sha256(ip + CHAT_IP_SALT) — reduced exposure, but still treat as personal data.';

-- Atomic increment so concurrent requests cannot lose counts.
create or replace function public.bump_chat_usage(
  p_day date,
  p_ip_hash text,
  p_tokens integer
) returns void
language sql
security definer
set search_path = public
as $$
  insert into public.chat_usage (day, ip_hash, messages, tokens)
  values (p_day, p_ip_hash, 1, greatest(p_tokens, 0))
  on conflict (day, ip_hash) do update
    set messages = public.chat_usage.messages + 1,
        tokens   = public.chat_usage.tokens + greatest(excluded.tokens, 0);
$$;

-- ── Anonymous question log ───────────────────────────────────────────────
-- Questions only: no IP, no session id, no assistant replies.
create table if not exists public.chat_questions (
  id         bigserial primary key,
  asked_at   timestamptz not null default now(),
  question   text        not null,
  card_ids   text[]      not null default '{}'
);

comment on table public.chat_questions is
  'Anonymous log of what visitors ask the assistant, for content planning.';

create index if not exists chat_questions_asked_at_idx
  on public.chat_questions (asked_at desc);

-- ── Lock down ────────────────────────────────────────────────────────────
-- Both tables are written only by the server using the service role key,
-- which bypasses RLS. Enabling RLS with no policies means the public anon
-- key cannot read or write either table.
alter table public.chat_usage      enable row level security;
alter table public.chat_questions  enable row level security;

-- ── Retention ────────────────────────────────────────────────────────────
-- Counters are only meaningful for the current day. Run periodically, or
-- schedule with pg_cron if it is enabled on the project.
delete from public.chat_usage where day < current_date - interval '7 days';
