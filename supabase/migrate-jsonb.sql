-- card_catalog: convert the rich structured fields to jsonb (validates JSON on insert,
-- prevents the missing-braces bug, queryable). rewards/pros/cons stay text[] (plain strings).
-- Run once in the Supabase SQL editor.

-- 1. Fix any welcome_bonus missing its outer braces
update public.card_catalog
set welcome_bonus = '{' || welcome_bonus || '}'
where welcome_bonus is not null and btrim(welcome_bonus) <> ''
  and left(btrim(welcome_bonus), 1) <> '{';

-- 2. Flatten the double-wrapped pros/cons ( ['{"pros":[...]}'] -> {...} )
update public.card_catalog
set pros = array(select jsonb_array_elements_text((pros[1])::jsonb -> 'pros'))
where cardinality(pros) = 1 and left(btrim(pros[1]), 1) = '{' and (pros[1])::jsonb ? 'pros';
update public.card_catalog
set cons = array(select jsonb_array_elements_text((cons[1])::jsonb -> 'cons'))
where cardinality(cons) = 1 and left(btrim(cons[1]), 1) = '{' and (cons[1])::jsonb ? 'cons';

-- 3. welcome_bonus: text -> jsonb
alter table public.card_catalog
  alter column welcome_bonus type jsonb using nullif(btrim(welcome_bonus), '')::jsonb;

-- 4. earn_caps: text -> jsonb
alter table public.card_catalog
  alter column earn_caps type jsonb using nullif(btrim(earn_caps), '')::jsonb;

-- 5. credit_score: text -> jsonb
alter table public.card_catalog
  alter column credit_score type jsonb using nullif(btrim(credit_score), '')::jsonb;

-- 6. benefits: text[] of JSON strings -> jsonb array of objects
--    (add-column avoids the "subquery in transform expression" restriction)
alter table public.card_catalog add column benefits_jsonb jsonb not null default '[]'::jsonb;
update public.card_catalog
  set benefits_jsonb = coalesce((select jsonb_agg(e::jsonb) from unnest(benefits) e), '[]'::jsonb);
alter table public.card_catalog drop column benefits;
alter table public.card_catalog rename column benefits_jsonb to benefits;

-- rewards, pros, cons stay text[] (plain strings).

-- 7. amex-aeroplan content cleanup: positioning description (no rate repetition),
--    and clear the now-redundant perks (rewards + benefits cover it).
update public.card_catalog
set description = 'American Express''s flagship Air Canada travel card: unlimited Maple Leaf Lounge access, comprehensive travel insurance, and elite-status perks built for frequent flyers.',
    perks = '{}'
where id = 'amex-aeroplan';
