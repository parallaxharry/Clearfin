import { CARDS } from "../src/lib/cards";

const q = (s: string) => "'" + String(s).replace(/'/g, "''") + "'";
const arr = (a: string[]) =>
  "ARRAY[" + a.map((p) => q(p)).join(", ") + "]::text[]";

const lines: string[] = [];
lines.push(`-- ClearFin cards table: schema + seed (generated from src/lib/cards.ts)`);
lines.push(`-- Run this once in the Supabase SQL editor.`);
lines.push(``);
lines.push(`create table if not exists public.cards (`);
lines.push(`  id           text primary key,`);
lines.push(`  name         text not null,`);
lines.push(`  issuer       text not null,`);
lines.push(`  annual_fee   numeric not null default 0,`);
lines.push(`  dining_rate  numeric not null default 0,`);
lines.push(`  grocery_rate numeric not null default 0,`);
lines.push(`  gas_rate     numeric not null default 0,`);
lines.push(`  travel_rate  numeric not null default 0,`);
lines.push(`  other_rate   numeric not null default 0,`);
lines.push(`  badge        text,`);
lines.push(`  color        text,`);
lines.push(`  description  text,`);
lines.push(`  img          text,`);
lines.push(`  bank_url     text,`);
lines.push(`  perks        text[] not null default '{}',`);
lines.push(`  sort_order   int not null default 0,`);
lines.push(`  created_at   timestamptz not null default now(),`);
lines.push(`  updated_at   timestamptz not null default now()`);
lines.push(`);`);
lines.push(``);
lines.push(`alter table public.cards enable row level security;`);
lines.push(`drop policy if exists "Public read cards" on public.cards;`);
lines.push(`create policy "Public read cards" on public.cards for select using (true);`);
lines.push(`-- Writes are intentionally not exposed to anon; edit via the table editor / service role.`);
lines.push(``);

CARDS.forEach((c: any, i: number) => {
  lines.push(
`insert into public.cards (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  ${q(c.id)}, ${q(c.name)}, ${q(c.issuer)}, ${c.annualFee}, ${c.rates.dining}, ${c.rates.grocery}, ${c.rates.gas}, ${c.rates.travel}, ${c.rates.other}, ${q(c.badge)}, ${q(c.color)}, ${q(c.description)}, ${q(c.img)}, ${q(c.bankUrl)}, ${arr(c.perks)}, ${i}
) on conflict (id) do nothing;`
  );
});

lines.push(``);
console.log(lines.join("\n"));
console.error(`Generated SQL for ${CARDS.length} cards.`);
