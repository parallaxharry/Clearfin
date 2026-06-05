import { CARDS } from "../src/lib/cards";

const q = (s: string) => "'" + String(s).replace(/'/g, "''") + "'";
const arr = (a: string[]) => "ARRAY[" + a.map((p) => q(p)).join(", ") + "]::text[]";

const L: string[] = [];
L.push(`-- ClearFin card_catalog: single editable table, populated from src/lib/cards.ts (121 verified cards).`);
L.push(`-- Core fields are filled from the code. Enrichment fields are left empty for the manual pass.`);
L.push(`-- Does NOT touch the existing paused 'cards' schema. Run once in the Supabase SQL editor.`);
L.push(``);
L.push(`create table if not exists public.card_catalog (`);
L.push(`  -- populated from code:`);
L.push(`  id            text primary key,`);
L.push(`  name          text not null,`);
L.push(`  issuer        text not null,`);
L.push(`  annual_fee    numeric not null default 0,`);
L.push(`  dining_rate   numeric not null default 0,`);
L.push(`  grocery_rate  numeric not null default 0,`);
L.push(`  gas_rate      numeric not null default 0,`);
L.push(`  travel_rate   numeric not null default 0,`);
L.push(`  other_rate    numeric not null default 0,`);
L.push(`  badge         text,`);
L.push(`  color         text,`);
L.push(`  description   text,`);
L.push(`  img           text,`);
L.push(`  bank_url      text,`);
L.push(`  perks         text[] not null default '{}',`);
L.push(`  sort_order    int not null default 0,`);
L.push(`  -- enrichment (fill in manually this weekend):`);
L.push(`  network             text,`);
L.push(`  first_year_free     boolean,`);
L.push(`  min_income_personal numeric,`);
L.push(`  min_income_household numeric,`);
L.push(`  purchase_apr        numeric,`);
L.push(`  fx_fee              numeric,`);
L.push(`  welcome_bonus       text,`);
L.push(`  earn_caps           text,`);
L.push(`  affiliate_url       text,`);
L.push(`  is_active           boolean not null default true,`);
L.push(`  notes               text,`);
L.push(`  created_at    timestamptz not null default now(),`);
L.push(`  updated_at    timestamptz not null default now()`);
L.push(`);`);
L.push(``);
L.push(`alter table public.card_catalog enable row level security;`);
L.push(`drop policy if exists "Public read card_catalog" on public.card_catalog;`);
L.push(`create policy "Public read card_catalog" on public.card_catalog for select using (true);`);
L.push(``);

CARDS.forEach((c: any, i: number) => {
  L.push(
`insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  ${q(c.id)}, ${q(c.name)}, ${q(c.issuer)}, ${c.annualFee}, ${c.rates.dining}, ${c.rates.grocery}, ${c.rates.gas}, ${c.rates.travel}, ${c.rates.other}, ${q(c.badge)}, ${q(c.color)}, ${q(c.description)}, ${q(c.img)}, ${q(c.bankUrl)}, ${arr(c.perks)}, ${i}
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();`
  );
});
L.push(``);
console.log(L.join("\n"));
console.error(`Generated card_catalog SQL for ${CARDS.length} cards.`);
