-- Card click analytics setup for ClearFin.
-- Run this in the Supabase SQL editor for the project.
-- The website API route writes to this table using SUPABASE_SERVICE_ROLE_KEY.

create extension if not exists pgcrypto;

create table if not exists public.card_clicks (
  id uuid primary key default gen_random_uuid(),
  card_id text not null,
  clicked_at timestamptz not null default now(),
  constraint card_clicks_card_id_not_blank check (length(trim(card_id)) > 0)
);

create index if not exists card_clicks_card_id_idx
  on public.card_clicks (card_id);

create index if not exists card_clicks_clicked_at_idx
  on public.card_clicks (clicked_at desc);

alter table public.card_clicks enable row level security;

-- No public select/update/delete/insert policies are created.
-- The server-side API route uses SUPABASE_SERVICE_ROLE_KEY to record clicks.
