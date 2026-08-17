-- Restore script for tables dropped from the live Supabase project on 2026-08-17.
--
-- These seven tables were an earlier normalised card schema (plus a planned
-- statement-upload feature) that was superseded by the flat `card_catalog`
-- table. At drop time all seven were EMPTY (0 rows) and referenced 0 times
-- anywhere in the codebase, and nothing outside the set had a foreign key to
-- them. Kept here so the schema can be recreated if any of it is ever wanted.
--
-- Run top to bottom: parents are created before the children that reference them.

create table if not exists public.issuers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  type        text not null default 'bank'
                check (type = any (array['bank','credit_union','digital','store','airline'])),
  logo_url    text,
  website_url text,
  created_at  timestamptz default now()
);

create table if not exists public.reward_programs (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  type              text not null
                      check (type = any (array['points','cashback','miles','hybrid'])),
  conservative_cpp  numeric,
  aspirational_cpp  numeric,
  best_redemption   text,
  expiry_rule       text,
  transfer_partners text[],
  notes             text,
  created_at        timestamptz default now()
);

create table if not exists public.cards (
  id                   uuid primary key default gen_random_uuid(),
  issuer_id            uuid not null references public.issuers(id) on delete cascade,
  reward_program_id    uuid references public.reward_programs(id),
  name                 text not null,
  slug                 text not null unique,
  network              text check (network = any (array['Visa','Mastercard','Amex','Other'])),
  tier                 text,
  card_type            text default 'credit'
                         check (card_type = any (array['credit','charge','prepaid'])),
  is_business          boolean default false,
  annual_fee           numeric default 0,
  supplementary_fee    numeric default 0,
  first_year_free      boolean default false,
  min_income_personal  numeric,
  min_income_household numeric,
  purchase_apr         numeric default 20.99,
  cash_advance_apr     numeric default 22.99,
  fx_fee               numeric default 2.50,
  is_active            boolean default true,
  is_closed_to_new     boolean default false,
  affiliate_url        text,
  image_url            text,
  notes                text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create table if not exists public.card_reward_rates (
  id              uuid primary key default gen_random_uuid(),
  card_id         uuid not null references public.cards(id) on delete cascade,
  category        text not null check (category = any (array[
                    'groceries','gas','dining','travel','transit','streaming',
                    'recurring_bills','drugstore','entertainment','shopping','hotels',
                    'car_rentals','foreign_currency','online_purchases','rideshare',
                    'food_delivery','air_canada','westjet','costco','office_supplies',
                    'specific_partner','everything_else'])),
  earn_rate       numeric not null,
  earn_rate_type  text default 'multiplier'
                    check (earn_rate_type = any (array['multiplier','percentage'])),
  earn_cap_amount numeric,
  earn_cap_period text check (earn_cap_period = any (array[
                    'monthly','annual','calendar_year','lifetime','per_cycle'])),
  partner_name    text,
  notes           text,
  created_at      timestamptz default now()
);

create table if not exists public.welcome_bonuses (
  id                uuid primary key default gen_random_uuid(),
  card_id           uuid not null references public.cards(id) on delete cascade,
  bonus_amount      numeric not null,
  bonus_type        text not null check (bonus_type = any (array[
                      'points','miles','cashback_dollars','statement_credit'])),
  min_spend         numeric,
  spend_period_days integer,
  bonus_structure   text,
  offer_expiry      date,
  is_current        boolean default true,
  created_at        timestamptz default now()
);

create table if not exists public.card_benefits (
  id           uuid primary key default gen_random_uuid(),
  card_id      uuid not null references public.cards(id) on delete cascade,
  category     text not null check (category = any (array[
                 'travel_insurance','purchase_protection','lounge_access','travel_credit',
                 'nexus_rebate','mobile_insurance','concierge','roadside_assistance',
                 'hotel_status','companion_voucher','checked_bag','priority_security',
                 'anniversary_bonus','other'])),
  name         text not null,
  description  text,
  annual_value numeric,
  created_at   timestamptz default now()
);

create table if not exists public.statement_uploads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null check (position('@' in email) > 1),
  file_path  text not null unique,
  file_name  text not null,
  file_type  text,
  file_size  bigint not null,
  status     text not null default 'received'
               check (status = any (array['received','reviewing','complete','rejected'])),
  created_at timestamptz not null default now()
);

-- A view sat on top of cards/issuers/reward_programs. Nothing referenced it.
create or replace view public.cards_full as
select c.id, c.issuer_id, c.reward_program_id, c.name, c.slug, c.network, c.tier,
       c.card_type, c.is_business, c.annual_fee, c.supplementary_fee, c.first_year_free,
       c.min_income_personal, c.min_income_household, c.purchase_apr, c.cash_advance_apr,
       c.fx_fee, c.is_active, c.is_closed_to_new, c.affiliate_url, c.image_url, c.notes,
       c.created_at, c.updated_at,
       i.name as issuer_name, i.slug as issuer_slug,
       rp.name as program_name, rp.conservative_cpp, rp.aspirational_cpp
from cards c
  left join issuers i on c.issuer_id = i.id
  left join reward_programs rp on c.reward_program_id = rp.id
where c.is_active = true;

-- All seven had RLS enabled with no policies, matching the rest of the project.
alter table public.issuers           enable row level security;
alter table public.reward_programs   enable row level security;
alter table public.cards             enable row level security;
alter table public.card_reward_rates enable row level security;
alter table public.welcome_bonuses   enable row level security;
alter table public.card_benefits     enable row level security;
alter table public.statement_uploads enable row level security;
