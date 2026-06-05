-- ClearFin card_catalog: single editable table, populated from src/lib/cards.ts (121 verified cards).
-- Core fields are filled from the code. Enrichment fields are left empty for the manual pass.
-- Does NOT touch the existing paused 'cards' schema. Run once in the Supabase SQL editor.

create table if not exists public.card_catalog (
  -- populated from code:
  id            text primary key,
  name          text not null,
  issuer        text not null,
  annual_fee    numeric not null default 0,
  dining_rate   numeric not null default 0,
  grocery_rate  numeric not null default 0,
  gas_rate      numeric not null default 0,
  travel_rate   numeric not null default 0,
  other_rate    numeric not null default 0,
  badge         text,
  color         text,
  description   text,
  img           text,
  bank_url      text,
  perks         text[] not null default '{}',
  sort_order    int not null default 0,
  -- enrichment (fill in manually this weekend):
  network             text,
  first_year_free     boolean,
  min_income_personal numeric,
  min_income_household numeric,
  purchase_apr        numeric,
  fx_fee              numeric,
  welcome_bonus       text,
  earn_caps           text,
  affiliate_url       text,
  is_active           boolean not null default true,
  notes               text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.card_catalog enable row level security;
drop policy if exists "Public read card_catalog" on public.card_catalog;
create policy "Public read card_catalog" on public.card_catalog for select using (true);

insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cobalt', 'Amex Cobalt', 'American Express', 191.88, 0.05, 0.05, 0.02, 0.01, 0.01, '🍽️ Best for Dining', 'var(--accent-rose)', '5x points on dining & groceries. Massive welcome bonus. Best for food spenders.', '/cards/amex-cobalt.webp', 'https://www.americanexpress.com/en-ca/credit-cards/cobalt-card/', ARRAY['5x on dining & food delivery', '5x on groceries', '2x on transit & gas', '1x on travel & everything else', '$15.99/month ($191.88/yr · $191.88/yr in Quebec)']::text[], 0
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotia-gold', 'Scotia Gold Amex', 'Scotiabank', 120, 0.05, 0.06, 0.03, 0.01, 0.01, '🛒 Best Grocery Card', 'var(--accent-warm)', '6x Scene+ at Sobeys, Safeway & more. 5x on dining, food delivery & entertainment. 3x on gas, transit & streaming.', '/cards/Scotiabank-gold-amex.avif', 'https://hello.scotiabank.com/lending/triage?productCode=AXG&subProductCode=GC&source=116B&language=en', ARRAY['6x Scene+ at Sobeys, Safeway, FreshCo, Foodland & more', '5x on dining, food delivery, food subscriptions & other grocery', '5x on eligible entertainment (movies, theatre, tickets)', '3x on gas, transit, rideshare & streaming services', 'Up to 4x on hotels & car rentals via Scene+ Travel · 1x all other travel · $120/yr annual fee']::text[], 1
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-aeroplan', 'TD Aeroplan Visa Infinite', 'TD Bank', 139, 0.01, 0.015, 0.015, 0.015, 0.01, '✈️ Best Travel', '#6B8FC9', '1.5x Aeroplan on gas, EV charging, groceries & Air Canada. 1x on everything else.', '/cards/td-aeroplan-infinite.png', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/', ARRAY['1.5x Aeroplan Points on gas, EV charging, groceries & Air Canada purchases', '1x Aeroplan Point on all other purchases', 'Earn points twice at 150+ Aeroplan partners & 200+ online retailers via Aeroplan eStore', 'Comprehensive travel insurance', '$139/yr annual fee']::text[], 2
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-avion', 'RBC Avion Visa Infinite', 'RBC', 120, 0.01, 0.01, 0.01, 0.01, 0.01, '🔄 Most Flexible', '#4A90D9', '1x Avion points on all purchases. Transfer to 30+ airline partners for flexible redemptions.', '/cards/rbc-avion-infinite.webp', 'https://apps.royalbank.com/apps/IAO/apply/cardapp?pid1=avion_inf&ASC=3D2111&_gl=1*1jecaqy*_gcl_au*MzQ5OTM5MDc2LjE3NzgzNzQ5MjI.*_ga*MjEwMDcyNDEyNC4xNzc4Mzc0OTIy*_ga_89NPCTDXQR*czE3NzgzNzQ5MjEkbzEkZzEkdDE3NzgzNzQ5NDgkajMzJGwwJGgw', ARRAY['1x Avion Point on all purchases', 'Transfer to 30+ airline partners', 'Flexible point redemptions', 'Travel insurance included', '$120/yr annual fee']::text[], 3
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-eclipse', 'BMO Eclipse Visa Infinite', 'BMO', 120, 0.0333, 0.0333, 0.0333, 0.0067, 0.0067, '⛽ Best Gas Card', '#2B6CB0', '5x BMO Rewards points per $1 on groceries, gas, transit & dining. 1x on everything else.', '/cards/bmo-eclipse.png', 'https://www.bmo.com/main/personal/credit-cards/getting-started/?lang=en&rg=BMO&PID=VISDX&MID=3930192&OFFERCODE=RQTSX00008&OFFERDATE=20251031&income_quiz=true&income=60000&household_income=100000&monthly_spend=1250&PIDBASE=VPVDM&PIDUP=VISDY&MIDBASE=3930758&OFFERCODEBASE=RQTVP00001&OFFERDATEBASE=20220910&MIDUP=6011141&OFFERCODEUP=RQTSY00005&OFFERDATEUP=20251031&income_up=150000&household_income_up=200000&monthly_spend_up=4167', ARRAY['5x BMO Rewards points per $1 on groceries', '5x per $1 on gas, public transit & rideshare', '5x per $1 on dining, takeout & food delivery', '1x BMO Rewards point per $1 on all other purchases', '$50 annual lifestyle credit · $120/yr annual fee']::text[], 4
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'wealthsimple', 'Wealthsimple Card', 'Wealthsimple', 0, 0.02, 0.02, 0.02, 0.02, 0.02, '💸 2% Everything', '#48BB78', '2% cashback on everything. No FX fees. Earn competitive interest on your cashback. Fee waived with $100K+ or qualifying paycheque deposit.', '/cards/newwealthsimple.webp', 'https://www.wealthsimple.com/en-ca/spend', ARRAY['2% cashback on all purchases', '0% foreign transaction fees', 'Monthly fee waived with $100K+ in assets or a qualifying paycheque deposit', 'Earn competitive interest on your cashback', 'No virtual card tap limit']::text[], 5
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'amex-gold', 'Amex Gold Rewards', 'American Express', 250, 0.01, 0.02, 0.02, 0.02, 0.01, '✈️ Travel Rewards', '#D4AF37', '2x on travel & dining. Flexible Membership Rewards. Good for travel spenders.', '/cards/amex-gold.avif', 'https://www.americanexpress.com/en-ca/credit-cards/gold-rewards-card/', ARRAY['2x points on travel & dining', '1x on everything else', 'Airport lounge access', 'Travel insurance included', '$250/yr annual fee']::text[], 6
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'amex-platinum', 'Amex Platinum Card', 'American Express', 799, 0.02, 0.01, 0.01, 0.02, 0.01, '💎 Ultra Premium', '#C0C0C0', 'Premium travel card with unlimited lounge access and top-tier insurance.', '/cards/amex-platinum.avif', 'https://www.americanexpress.com/en-ca/credit-cards/the-platinum-card/', ARRAY['3x on travel & dining', 'Unlimited airport lounge access', '$200 annual travel credit', 'Premium concierge service', '$799/yr annual fee']::text[], 7
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'amex-simply-cash-preferred', 'Amex SimplyCash Preferred', 'American Express', 119.88, 0.02, 0.04, 0.04, 0.02, 0.0125, '⛽ Gas Cashback', '#2D5A27', '4% cashback on gas & groceries. 1.25% on everything else. Best flat-rate cashback Amex.', '/cards/amex-simply-cash-preferred.avif', 'https://www.americanexpress.com/en-ca/credit-cards/simplycash-preferred-card/', ARRAY['4% cashback on gas', '4% cashback on groceries', '1.25% on all other purchases', 'Purchase protection', '$9.99/month ($119.88/yr · $119/yr in Quebec)']::text[], 8
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'amex-simply-cash', 'Amex SimplyCash', 'American Express', 0, 0.0125, 0.02, 0.02, 0.0125, 0.0125, '💸 No-Fee Cashback', '#2D5A27', '2% on gas & groceries (grocery capped at $300/yr cashback). 1.25% on everything else including dining.', '/cards/amex-simply-cash.webp', 'https://www.americanexpress.com/en-ca/credit-cards/simplycash-card/', ARRAY['2% cashback on gas', '2% cashback on groceries (max $300/yr)', '1.25% on everything else including dining', 'No annual fee', 'Purchase protection']::text[], 9
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'amex-marriott', 'Amex Marriott Bonvoy', 'American Express', 150, 0.03, 0.02, 0.03, 0.05, 0.02, '🏨 Hotel Points', '#8B0000', '5x points at Marriott hotels. 3x on gas, dining & travel. 2x on everything else.', '/cards/amex-marriott.avif', 'https://www.americanexpress.com/en-ca/credit-cards/marriott-bonvoy-american-express/', ARRAY['5x Bonvoy points at participating Marriott hotels', '3x points on gas, dining & travel', '2x points on everything else', 'Annual free night certificate', '$150/yr annual fee']::text[], 10
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'amex-business-edge', 'Amex Business Edge', 'American Express', 99, 0.03, 0.03, 0.03, 0.01, 0.01, '💼 Business Card', '#1a3a5c', '3x on business essentials: dining, grocery, gas. Great for small business owners.', '/cards/amex-business-edge.avif', 'https://www.americanexpress.com/en-ca/credit-cards/business-edge-card/', ARRAY['3x on dining, groceries & gas', '1x on all other purchases', 'Employee cards available', 'Business insights dashboard', '$99/yr annual fee']::text[], 11
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'amex-aeroplan', 'Amex Aeroplan Reserve', 'American Express', 599, 0.02, 0.0125, 0.0125, 0.03, 0.0125, '✈️ Aeroplan Elite', '#003366', '3x Aeroplan on Air Canada. 2x on dining & food delivery. 1.25x on everything else.', '/cards/amex-aeroplan.avif', 'https://www.americanexpress.com/en-ca/credit-cards/aeroplan-reserve-card/', ARRAY['3x Aeroplan points on Air Canada & Air Canada Vacations', '2x Aeroplan points on dining & food delivery in Canada', '1.25x points on everything else', 'Priority boarding & check-in', '$599/yr annual fee']::text[], 12
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotia-passport', 'Scotia Passport Visa Infinite', 'Scotiabank', 150, 0.02, 0.03, 0.01, 0.01, 0.01, '🌍 No FX Fees', '#CC0000', '3x Scene+ at Sobeys & participating grocers. 2x on dining, entertainment & transit. 1x everything else. No FX fees.', '/cards/scotia-passport.webp', 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/passport-infinite-card.html', ARRAY['3x Scene+ at Sobeys, Safeway, Foodland, IGA & co-ops', '2x on dining & other eligible grocery stores', '2x on entertainment (movies, theatre, tickets)', '2x on transit (rideshare, buses, taxis, subways) · Up to 4x hotels & car rentals via Scene+ Travel · 1x all other travel', 'No foreign transaction fees · $150/yr annual fee']::text[], 13
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotia-passport-privilege', 'Scotia Passport Visa Infinite Privilege', 'Scotiabank', 599, 0.02, 0.01, 0.01, 0.03, 0.01, '✈️ Premium Travel', '#CC0000', '3x Scene+ on travel. Up to 6x on hotels & car rentals via Scene+ Travel. 2x on dining & entertainment.', '/cards/scotia-passport-privilege.avif', 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/passport-visa-infinite-privilege-card.html', ARRAY['3x Scene+ on eligible travel purchases', 'Up to 6x on hotels & car rentals via Scene+ Travel (3x base + 3x extra)', '2x on eligible dining & entertainment', '1x on all other eligible purchases', '$599/yr annual fee']::text[], 14
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotia-momentum-infinite', 'Scotia Momentum Visa Infinite', 'Scotiabank', 120, 0.02, 0.04, 0.02, 0.01, 0.01, '💵 Cashback King', '#CC0000', '4% cashback on groceries & recurring bills. 2% on gas, transit & food delivery. 1% on everything else.', '/cards/scotia-momentum-infinite.webp', 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-infinite-card.html', ARRAY['4% cashback on groceries & recurring payments (bills & subscriptions)', '2% on gas, EV charging, transit, rideshares & food delivery', '1% on all other purchases including restaurant dining & travel', '4% & 2% rates apply on first $25,000 in annual spend · 1% after', '$120/yr annual fee']::text[], 15
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotia-momentum', 'Scotia Momentum Visa', 'Scotiabank', 49, 0.02, 0.02, 0.02, 0.01, 0.01, '💵 Everyday Cashback', '#CC0000', '2% on groceries, food delivery, drugstores, gas, transit & recurring bills. 1% on everything else.', '/cards/scotia_momentum_visa.avif', 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-no-fee-card.html', ARRAY['2% cashback on groceries, food delivery & food subscriptions', '2% on drugstore purchases', '2% on gas, EV charging, transit & rideshares', '2% on recurring bills & eligible streaming subscriptions', '$49/yr annual fee · 1% on all other purchases']::text[], 16
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotia-momentum-student', 'Scotia Momentum Visa for Students', 'Scotiabank', 49, 0.02, 0.02, 0.02, 0.01, 0.01, '🎓 Student Cashback', '#CC0000', 'Same 2% cashback as the Momentum Visa. Designed for students.', '/cards/scotia_momentum_visa.avif', 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/momentum-no-fee-card.html', ARRAY['2% cashback on groceries, food delivery & food subscriptions', '2% on drugstore purchases', '2% on gas, EV charging, transit & rideshares', '2% on recurring bills & eligible streaming subscriptions', '$49/yr annual fee · 1% on all other purchases']::text[], 17
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scene-plus-visa', 'Scene+ Visa', 'Scotiabank', 0, 0.01, 0.02, 0.01, 0.01, 0.01, '🎬 Scene+ Points', '#CC0000', '2x Scene+ at Sobeys, Safeway & partner grocers. 2x at Cineplex & Home Hardware. Up to 4x on hotels via Scene+ Travel.', '/cards/scene-plus-visa.webp', 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/scene-card.html', ARRAY['2x Scene+ at Sobeys, Safeway, Foodland, IGA & co-ops', '2x at Cineplex theatres & cineplex.com', '2x at Home Hardware, Home Building Centre & Home Furniture in Canada', 'Up to 4x on hotels & car rentals via Scene+ Travel · 1x all other travel', 'No annual fee · 1x on everything else']::text[], 18
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotiabank-amex', 'Scotiabank American Express Card', 'Scotiabank', 0, 0.02, 0.03, 0.02, 0.01, 0.01, '🆓 No-Fee Amex', '#CC0000', '3x Scene+ at Sobeys & major grocers. 2x on dining, food delivery, entertainment, gas & streaming. No annual fee.', '/cards/scotibank_amex_red.png', 'https://www.scotiabank.com/ca/en/personal/credit-cards/american-express.html', ARRAY['3x Scene+ at Sobeys, Safeway, FreshCo, Foodland & more', '2x on dining, food delivery, food subscriptions & other eligible grocery', '2x on entertainment (movies, theatre, tickets)', '2x on gas, transit, rideshares & eligible streaming services', 'Up to 4x on hotels & car rentals via Scene+ Travel · 1x all other travel · No annual fee']::text[], 19
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotia-platinum', 'Scotiabank Platinum Amex', 'Scotiabank', 399, 0.02, 0.02, 0.02, 0.02, 0.02, '💳 Flat-Rate Premium', '#CC0000', '2x Scene+ on all eligible purchases. Up to 5x on hotels & car rentals via Scene+ Travel. Unlimited lounge access.', '/cards/scotia-platinum.webp', 'https://www.scotiabank.com/ca/en/personal/credit-cards/american-express/platinum-card.html', ARRAY['2x Scene+ on all eligible purchases', 'Up to 5x on hotels & car rentals via Scene+ Travel (2x base + 3x extra)', 'Unlimited airport lounge access', 'No foreign transaction fees', '$399/yr annual fee']::text[], 20
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotia-momentum-no-fee', 'Scotia Momentum No-Fee Mastercard', 'Scotiabank', 0, 0.005, 0.01, 0.01, 0.005, 0.005, '💸 No-Fee Cashback', '#CC0000', '1% cashback on gas, groceries, drugstores & recurring bills. 0.5% on everything else. No annual fee.', '/cards/scotia-momentum-mastercard.avif', 'https://www.scotiabank.com/ca/en/personal/credit-cards/mastercard/momentum-no-fee-mastercard-card.html', ARRAY['1% cashback on eligible gas, grocery & drugstore purchases', '1% on eligible recurring bill payments (utilities, gym memberships)', '0.5% on all other eligible purchases', 'No annual fee', 'Purchase security & extended warranty']::text[], 21
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotiabank-value', 'Scotiabank Value Visa', 'Scotiabank', 29, 0.005, 0.005, 0.005, 0.005, 0.005, '📉 Low Rate', '#CC0000', 'Low interest rate. Best for carrying a balance occasionally.', '/cards/scotiabank-value.webp', 'https://www.scotiabank.com/ca/en/personal/credit-cards/visa/value-card.html', ARRAY['Low purchase interest rate', 'Low balance transfer rate', 'Purchase security', '$29/yr annual fee', 'Simple rewards-free option']::text[], 22
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotiabank-no-fee', 'Scotiabank No-Fee Visa', 'Scotiabank', 0, 0.005, 0.005, 0.005, 0.005, 0.005, '🆓 No Fee', '#CC0000', 'Basic no-fee Visa. Entry-level card with no frills.', '/cards/scotia_no_fee_visa.webp', 'https://www.scotiabank.com/ca/en/personal/credit-cards.html', ARRAY['No annual fee', 'Purchase security', 'Online banking access', 'Fraud monitoring', 'Basic starter card']::text[], 23
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-aeroplan-platinum', 'TD Aeroplan Visa Platinum', 'TD Bank', 89, 0.0067, 0.01, 0.01, 0.01, 0.0067, '✈️ Aeroplan Starter', '#00A758', '1x Aeroplan on gas, EV charging, groceries & Air Canada. 1 pt per $1.50 on everything else.', '/cards/td-aeroplan-platinum.jpeg', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/', ARRAY['1x Aeroplan Point per $1 on gas, EV charging, groceries & Air Canada purchases', '1x Aeroplan Point per $1.50 on all other purchases', 'Earn points twice at 150+ Aeroplan partners & 200+ online retailers via Aeroplan eStore', 'Travel insurance included', '$89/yr annual fee']::text[], 24
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-aeroplan-privilege', 'TD Aeroplan Visa Infinite Privilege', 'TD Bank', 599, 0.015, 0.015, 0.015, 0.02, 0.0125, '✈️ Aeroplan Elite', '#00A758', '2x Aeroplan on Air Canada. 1.5x on dining, grocery, gas, transit & travel. 1.25x on everything else.', '/cards/td-aeroplan-privilege.jpeg', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/', ARRAY['2x Aeroplan Points on eligible Air Canada & Air Canada Vacations purchases', '1.5x Aeroplan Points on dining, groceries, gas, EV charging, travel & transit', '1.25x Aeroplan Points on all other purchases', 'Earn points twice at 150+ Aeroplan partners & 200+ online retailers via Aeroplan eStore', 'Priority boarding · Maple Leaf Lounge access · $599/yr annual fee']::text[], 25
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-cashback-infinite', 'TD Cash Back Visa Infinite', 'TD Bank', 139, 0.01, 0.03, 0.03, 0.01, 0.01, '💵 3% Cashback', '#00A758', '3% cashback on groceries, gas, EV charging & transit. 3% on recurring bills & streaming. 1% on everything else.', '/cards/td-cashback-infinite.jpeg', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back/', ARRAY['3% cashback on groceries, gas, EV charging & public transit', '3% on recurring bill payments, streaming, digital gaming & media', '1% on all other purchases including dining & travel', '$139/yr annual fee']::text[], 26
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-cashback-visa', 'TD Cash Back Visa', 'TD Bank', 0, 0.005, 0.01, 0.01, 0.005, 0.005, '💸 No-Fee Cashback', '#00A758', '1% cashback on groceries, gas, EV charging & transit. 1% on recurring bills & streaming. 0.5% on everything else.', '/cards/td-cashback-visa.jpeg', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back/', ARRAY['1% cashback on groceries, gas, EV charging & public transit', '1% on recurring bill payments, streaming, digital gaming & media', '0.5% on all other purchases including dining & travel', 'No annual fee']::text[], 27
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-first-class', 'TD First Class Travel Visa Infinite', 'TD Bank', 139, 0.03, 0.03, 0.01, 0.04, 0.01, '✈️ Travel Points', '#00A758', '8x TD Points via Expedia for TD. 6x on groceries, dining & transit. 4x on bills & streaming. 2x on everything else.', '/cards/td-first-class.jpeg', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/travel/', ARRAY['8x TD Rewards Points on travel booked via Expedia for TD', '6x TD Rewards Points on groceries, dining & public transit', '4x TD Rewards Points on recurring bills, streaming, digital gaming & media', '2x TD Rewards Points on all other purchases', 'Up to 10,000 TD Rewards pts Birthday Bonus annually · $139/yr annual fee']::text[], 28
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-platinum-travel', 'TD Platinum Travel Visa', 'TD Bank', 89, 0.0225, 0.0225, 0.0075, 0.03, 0.0075, '✈️ Travel Starter', '#00A758', '6x TD Points via Expedia for TD. 4.5x on groceries, dining & transit. 3x on bills & streaming. 1.5x on everything else.', '/cards/td-platinum-travel.jpg', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/travel/', ARRAY['6x TD Rewards Points on travel via Expedia for TD', '4.5x TD Rewards Points on groceries, dining & public transit', '3x TD Rewards Points on recurring bills, streaming, digital gaming & media', '1.5x TD Rewards Points on all other purchases', '$89/yr annual fee']::text[], 29
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-rewards-visa', 'TD Rewards Visa', 'TD Bank', 0, 0.015, 0.015, 0.005, 0.02, 0.005, '🆓 No-Fee Points', '#00A758', '4x TD Points via Expedia for TD. 3x on groceries, dining & transit. 2x on bills & streaming. 1x on everything else. No fee.', '/cards/td-rewards-visa.jpg', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/', ARRAY['4x TD Rewards Points on travel via Expedia for TD', '3x TD Rewards Points on groceries, dining & public transit', '2x TD Rewards Points on recurring bills, streaming, digital gaming & media', '1x TD Rewards Points on all other purchases', 'No annual fee']::text[], 30
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-business-travel', 'TD Business Travel Visa', 'TD Bank', 149, 0.03, 0.01, 0.03, 0.045, 0.01, '💼 Business Travel', '#00A758', '9x TD Points via Expedia for TD. 6x on dining, transit, EV charging, streaming, bills & foreign currency. Business card.', '/cards/td-business-travel.jpeg', 'https://www.td.com/ca/en/business-banking/products/credit-cards/business-travel-visa/', ARRAY['9x TD Rewards Points on travel via ExpediaForTD.com', '6x TD Rewards Points on dining, EV charging & public transit', '6x TD Rewards Points on streaming, digital gaming & recurring bills', '6x TD Rewards Points on foreign currency purchases', '2x TD Rewards Points on all other purchases · $149/yr annual fee']::text[], 31
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-emerald', 'TD Emerald Flex Rate Visa', 'TD Bank', 25, 0.005, 0.005, 0.005, 0.005, 0.005, '📉 Flexible Rate', '#00A758', 'Variable low interest rate. Good for those who occasionally carry a balance.', '/cards/td-emerald.png', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/', ARRAY['Variable interest rate', 'Low annual fee', 'Purchase security', 'Online banking access', '$25/yr annual fee']::text[], 32
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'td-green', 'TD Green Visa', 'TD Bank', 0, 0.005, 0.005, 0.005, 0.005, 0.005, '🌱 Starter Card', '#00A758', 'TD''s most basic no-fee card. Simple, no rewards.', '/cards/td-green.jpeg', 'https://www.td.com/ca/en/personal-banking/products/credit-cards/', ARRAY['No annual fee', 'Basic Visa benefits', 'Fraud protection', 'Online banking', 'Good for credit building']::text[], 33
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-avion-platinum', 'RBC Avion Visa Platinum', 'RBC', 120, 0.01, 0.01, 0.01, 0.01, 0.01, '✈️ Avion Points', '#005DAA', '1x Avion point on all eligible purchases including travel. Transfer to 30+ airline partners.', '/cards/rbc-avion-platinum.jpeg', 'https://www.rbcroyalbank.com/credit-cards/avion-platinum-visa.html', ARRAY['1x Avion Point on travel-related purchases', '1x Avion Point on all other eligible purchases', 'Transfer to 30+ airline partners', 'Travel insurance included', '$120/yr annual fee']::text[], 34
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-avion-privilege', 'RBC Avion Visa Infinite Privilege', 'RBC', 399, 0.0125, 0.0125, 0.0125, 0.0125, 0.0125, '💎 Premium Avion', '#005DAA', '1.25x Avion on all qualifying purchases. Double redemption value on Business & First-Class tickets.', '/cards/rbc-avion-privilege.webp', 'https://www.rbcroyalbank.com/credit-cards/avion-infinite-privilege.html', ARRAY['1.25x Avion Points on all qualifying purchases', 'Double redemption value on Business & First-Class tickets', 'Priority airport check-in & lounge access', 'Comprehensive travel insurance', '$399/yr annual fee · Requires $200,000 min personal income']::text[], 35
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-ion-plus', 'RBC ION+ Visa', 'RBC', 48, 0.03, 0.03, 0.03, 0.01, 0.01, '⚡ Everyday Earn', '#005DAA', '3x Avion points on groceries, dining, and gas. Great everyday earner for the price.', '/cards/rbc-ion-plus.webp', 'https://www.rbcroyalbank.com/credit-cards/ion-plus-visa.html', ARRAY['3x Avion on grocery, dining & gas', '1x on all other purchases', 'ION+ Rewards redemption', 'Purchase security', '$48/yr annual fee']::text[], 36
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-ion', 'RBC ION Visa', 'RBC', 0, 0.01, 0.015, 0.015, 0.01, 0.01, '🆓 No-Fee Earn', '#005DAA', '1.5x Avion on groceries, gas, rideshare & streaming. 1x on everything else. No annual fee.', '/cards/rbc-ion.webp', 'https://www.rbcroyalbank.com/credit-cards/ion-visa.html', ARRAY['1.5x Avion Points on groceries, gas, rideshare & streaming services', '1x Avion Point on all other qualifying purchases', 'No annual fee', 'Avion Rewards program', 'Easy mobile management']::text[], 37
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-cashback', 'RBC Cash Back Mastercard', 'RBC', 0, 0.01, 0.02, 0.01, 0.01, 0.01, '💸 No-Fee Cashback', '#005DAA', 'Up to 2% cashback on groceries. 1% on all other everyday purchases. No annual fee.', '/cards/rbc-cashback-mastercard.jpeg', 'https://www.rbcroyalbank.com/credit-cards/cash-back-mastercard.html', ARRAY['Up to 2% cashback on grocery store purchases', '1% cashback on all other everyday purchases', 'No annual fee', 'Purchase security', 'Easy cashback redemption']::text[], 38
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-cashback-world-elite', 'RBC Cash Back Preferred World Elite Mastercard', 'RBC', 99, 0.015, 0.015, 0.015, 0.015, 0.015, '💵 Flat-Rate Cashback', '#005DAA', 'Up to 1.5% cash back on all purchases including online & wholesale retailers.', '/cards/rbc-cashback-world-elite.webp', 'https://www.rbcroyalbank.com/credit-cards/cash-back-world-elite-mastercard.html', ARRAY['Up to 1.5% cash back on all purchases', 'Includes online & wholesale retailers', 'World Elite Mastercard benefits', 'Travel insurance included', '$99/yr annual fee']::text[], 39
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-more-rewards', 'More Rewards RBC Visa', 'RBC', 0, 0.01, 0.01, 0.01, 0.006, 0.006, '🛒 More Rewards', '#005DAA', '5x More Rewards on groceries, pharmacy, gas & dining. 3x on everything else. No annual fee.', '/cards/rbc-more-rewards.jpeg', 'https://www.rbcroyalbank.com/credit-cards/more-rewards-visa.html', ARRAY['5 More Rewards pts/$1 at 700+ grocery, pharmacy & partner locations', '5 More Rewards pts/$1 on gas, EV charging & dining', '3 More Rewards pts/$1 on all other purchases', 'Redeem at Save-On-Foods, Urban Fare & More Rewards partners', 'No annual fee']::text[], 40
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-more-rewards-infinite', 'More Rewards RBC Visa Infinite', 'RBC', 0, 0.016, 0.016, 0.016, 0.008, 0.008, '🛒 More Rewards', '#005DAA', '8x More Rewards on groceries, pharmacy, gas, EV & dining. 4x on everything else. No annual fee.', '/cards/rbc-more-rewards-infinite.jpeg', 'https://www.rbcroyalbank.com/credit-cards/more-rewards-visa-infinite.html', ARRAY['8 More Rewards pts/$1 at 700+ grocery, pharmacy & partner locations', '8 More Rewards pts/$1 on gas, EV charging & dining', '4 More Rewards pts/$1 on all other purchases', 'Redeem at Save-On-Foods, Urban Fare & More Rewards partners', 'No annual fee']::text[], 41
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-westjet-world-elite', 'RBC WestJet World Elite Mastercard', 'RBC', 139, 0.015, 0.02, 0.02, 0.02, 0.015, '✈️ WestJet Dollars', '#0A5FA8', '2 WestJet dollars/$1 on WestJet, groceries & transportation. 1.5 on everything else.', '/cards/rbc-westjet-world-elite.webp', 'https://www.westjet.com/en-ca/credit-cards/world-elite-mastercard', ARRAY['2 WestJet dollars/$1 on WestJet flights, WestJet Vacations & Sunwing Vacations', '2 WestJet dollars/$1 on groceries, gas, EV charging, transit & rideshare', '1.5 WestJet dollars/$1 on all other everyday purchases', 'Annual companion voucher · Free checked bag on WestJet', '$139/yr annual fee · Requires $80,000 min personal income']::text[], 42
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-westjet', 'WestJet RBC Mastercard', 'RBC', 39, 0.015, 0.01, 0.01, 0.015, 0.01, '✈️ WestJet Starter', '#0A5FA8', '1.5 WestJet dollars on WestJet, dining, food delivery & streaming. 1 WestJet dollar on everything else.', '/cards/rbc-westjet.webp', 'https://www.westjet.com/en-ca/credit-cards/mastercard', ARRAY['1.5 WestJet dollars/$1 on WestJet flights, WestJet Vacations & Sunwing Vacations', '1.5 WestJet dollars/$1 on restaurants, food delivery, streaming & digital gaming', '1 WestJet dollar/$1 on all other everyday purchases', 'Free checked bag on WestJet', '$39/yr annual fee']::text[], 43
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rbc-british-airways', 'RBC British Airways Visa Infinite', 'RBC', 165, 0.02, 0.01, 0.01, 0.03, 0.01, '✈️ Avios Points', '#075AAA', '3 Avios on British Airways. 2 Avios on dining & food delivery. 1 Avios on everything else.', '/cards/rbc-british-airways.webp', 'https://www.rbcroyalbank.com/credit-cards/british-airways-visa-infinite.html', ARRAY['3 Avios/$1 on British Airways purchases', '2 Avios/$1 on dining & food delivery', '1 Avios/$1 on all other qualifying purchases', 'Avios travel redemptions', '$165/yr annual fee']::text[], 44
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-eclipse-rise', 'BMO Eclipse Rise Visa', 'BMO', 0, 0.0167, 0.0167, 0.0067, 0.0067, 0.0067, '🆓 No-Fee Rewards', '#0079C1', '5x BMO Rewards points per $2 on groceries, dining, takeout & recurring bills. 1x on everything else. No annual fee.', '/cards/bmo-eclipse-rise.jpg', 'https://www.bmo.com/main/personal/credit-cards/', ARRAY['5x BMO Rewards points per $2 on recurring bills, groceries, dining & takeout', '1x BMO Rewards point per $1 on all other purchases', '3 months complimentary Instacart+ with $5 monthly credit', 'No annual fee', 'BMO Rewards program']::text[], 45
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-ascend-world-elite', 'BMO Ascend World Elite Mastercard', 'BMO', 150, 0.02, 0.0067, 0.0067, 0.0333, 0.0067, '✈️ Travel Rewards', '#0079C1', '5x BMO Rewards on travel. 3x on dining, entertainment & recurring bills. 1x on everything else.', '/cards/bmo-ascend.webp', 'https://www.bmo.com/main/personal/credit-cards/bmo-ascend-world-elite-mastercard/', ARRAY['5x BMO Rewards points per $1 on eligible travel', '3x per $1 on eligible dining', '3x per $1 on eligible entertainment', '3x per $1 on recurring bill payments', '1x per $1 on everything else · $150/yr annual fee']::text[], 46
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-eclipse-privilege', 'BMO Eclipse Visa Infinite Privilege', 'BMO', 599, 0.0333, 0.0333, 0.0333, 0.0333, 0.0067, '💎 Premium Rewards', '#0079C1', '5x BMO Rewards on groceries, dining, gas, drugstore & travel. 1x on everything else.', '/cards/bmo-eclipse-privilege.jpg', 'https://www.bmo.com/main/personal/credit-cards/bmo-eclipse-visa-infinite-privilege/', ARRAY['5x BMO Rewards points per $1 on groceries', '5x per $1 on dining & takeout', '5x per $1 on gas', '5x per $1 on drugstore (healthcare & beauty)', '5x per $1 on travel · $599/yr · Requires $150,000 min personal income']::text[], 47
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-viporter', 'BMO VIPorter Mastercard', 'BMO', 89, 0.01, 0.01, 0.01, 0.01, 0.005, '✈️ Porter Points', '#0079C1', '2x VIPorter points on Porter. 1x on travel, gas, groceries, dining & hotels. 0.5x everywhere else.', '/cards/bmo-viporter.webp', 'https://www.bmo.com/main/personal/credit-cards/bmo-viporter-mastercard/', ARRAY['2x VIPorter points per $1 on Porter purchases', '1x per $1 on everyday travel (gas & transportation)', '1x per $1 on groceries & dining', '1x per $1 on hotel accommodations', '0.5x per $1 everywhere else · $89/yr annual fee']::text[], 48
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-viporter-world-elite', 'BMO VIPorter World Elite Mastercard', 'BMO', 199, 0.02, 0.02, 0.02, 0.02, 0.01, '✈️ Porter Elite', '#0079C1', '3x VIPorter points on Porter. 2x on travel, gas, groceries, dining & hotels. 1x everywhere else.', '/cards/bmo-viporter-world-elite.webp', 'https://www.bmo.com/main/personal/credit-cards/bmo-viporter-world-elite-mastercard/', ARRAY['3x VIPorter points per $1 on Porter purchases', '2x per $1 on everyday travel (gas & transportation)', '2x per $1 on groceries & dining', '2x per $1 on hotel accommodations', '1x per $1 everywhere else · $199/yr annual fee']::text[], 49
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-cashback-world-elite', 'BMO CashBack World Elite Mastercard', 'BMO', 120, 0.01, 0.05, 0.03, 0.01, 0.01, '🛒 5% Groceries', '#0079C1', '5% on groceries, 4% on transit, 3% on gas, 2% on recurring bills. Highest grocery cashback in Canada.', '/cards/bmo-cashback-world-elite.webp', 'https://www.bmo.com/main/personal/credit-cards/bmo-cashback-world-elite-mastercard/', ARRAY['5% cashback on groceries (highest in Canada)', '4% on transit, ride sharing, taxis & public transportation', '3% on gas & EV charging', '2% on recurring bills (phone, gym, streaming)', '1% on all other purchases · $120/yr annual fee']::text[], 50
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-cashback', 'BMO CashBack Mastercard', 'BMO', 0, 0.005, 0.03, 0.005, 0.005, 0.005, '🛒 Grocery Cashback', '#0079C1', '3% cashback on groceries. 1% on recurring bills. 0.5% on everything else. No annual fee.', '/cards/bmo-cashback.webp', 'https://www.bmo.com/main/personal/credit-cards/bmo-cashback-mastercard/', ARRAY['3% cashback on grocery purchases', '1% cashback on recurring bill payments (streaming, subscriptions, utilities)', '0.5% cashback on all other purchases', 'No annual fee', 'Unlimited cashback']::text[], 51
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-preferred-rate', 'BMO Preferred Rate Mastercard', 'BMO', 20, 0.005, 0.005, 0.005, 0.005, 0.005, '📉 Low Interest', '#0079C1', 'Low purchase interest rate. Best for occasional balance carriers.', '/cards/bmo-preferred-rate.webp', 'https://www.bmo.com/main/personal/credit-cards/bmo-preferred-rate-mastercard/', ARRAY['Low purchase interest rate', 'Low balance transfer rate', 'Purchase security', 'Extended warranty', '$20/yr annual fee']::text[], 52
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'bmo-student', 'BMO CashBack Mastercard for Students', 'BMO', 0, 0.005, 0.03, 0.005, 0.005, 0.005, '🎓 Student Cashback', '#0079C1', '3% cashback on groceries. 1% on recurring bills. 0.5% on everything else. No annual fee, no minimum income.', '/cards/bmo-student-cashback-mastercard.webp', 'https://www.bmo.com/main/personal/credit-cards/', ARRAY['3% cashback on grocery purchases', '1% cashback on recurring bill payments (mobile, streaming, subscriptions)', '0.5% cashback on all other purchases', 'No annual fee · No minimum income required', 'Student-friendly credit building']::text[], 53
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aventura-infinite', 'CIBC Aventura Visa Infinite', 'CIBC', 139, 0.01, 0.015, 0.015, 0.02, 0.01, '✈️ Aventura Points', '#C41230', '2x Aventura on travel via CIBC Rewards Centre. 1.5x on gas, EV, groceries & drugstores. 1x everything else.', '/cards/cibc-aventura-infinite.webp', 'https://www.cibc.com/en/personal-banking/credit-cards/aventura-visa-infinite.html', ARRAY['2x Aventura Points on travel booked via CIBC Rewards Centre (Expedia)', '1.5x Aventura Points on gas, EV charging, groceries & drugstores', '1x Aventura Point on all other purchases', 'Up to 10¢/L off eligible gas', '$139/yr annual fee']::text[], 54
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aventura-privilege', 'CIBC Aventura Visa Infinite Privilege', 'CIBC', 499, 0.02, 0.02, 0.02, 0.03, 0.0125, '💎 Aventura Elite', '#C41230', '3x Aventura on travel via CIBC Rewards Centre. 2x on dining, entertainment, transport, gas & groceries. 1.25x else.', '/cards/cibc_aventura_cibc.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/aventura-visa-infinite-privilege.html', ARRAY['3x Aventura Points on travel booked via CIBC Rewards Centre (Expedia)', '2x Aventura Points on dining, entertainment, transport, gas, EV charging & groceries', '1.25x Aventura Points on all other purchases', 'Airport lounge access · Up to 10¢/L off gas', '$499/yr annual fee']::text[], 55
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aventura-gold', 'CIBC Aventura Gold Visa', 'CIBC', 139, 0.01, 0.015, 0.015, 0.02, 0.01, '✈️ Aventura Points', '#C41230', '2x Aventura on travel via CIBC Rewards Centre. 1.5x on gas, EV, groceries & drugstores. 1x everything else.', '/cards/cibc-aventura-gold.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/aventura-gold-visa.html', ARRAY['2x Aventura Points on travel booked via CIBC Rewards Centre (Expedia)', '1.5x Aventura Points on gas, EV charging, groceries & drugstores', '1x Aventura Point on all other purchases', 'Up to 10¢/L off eligible gas', '$139/yr annual fee']::text[], 56
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aventura-visa', 'CIBC Aventura Visa', 'CIBC', 0, 0.005, 0.01, 0.01, 0.01, 0.005, '🆓 No-Fee Aventura', '#C41230', '1x Aventura on gas, EV, groceries, drugstores & travel. 1 pt per $2 on everything else. No annual fee.', '/cards/cibc-aventura-visa.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/aventura-visa.html', ARRAY['1x Aventura Point on gas, EV charging, groceries & drugstores', '1x Aventura Point on travel booked via CIBC Rewards Centre (Expedia)', '1 Aventura Point per $2 on all other purchases', 'Up to 10¢/L off eligible gas', 'No annual fee']::text[], 57
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-adapta', 'CIBC Adapta Mastercard', 'CIBC', 0, 0.015, 0.015, 0.015, 0.02, 0.01, '🔄 Adaptive Earn', '#C41230', '2x Adapta on travel via CIBC by Expedia. 1.5x on your top 3 spend categories each month. 1x else. No annual fee.', '/cards/cibc-adapta.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/adapta-mastercard.html', ARRAY['2x Adapta Points on travel booked via CIBC by Expedia', '1.5x Adapta Points on your top 3 spend categories each month (dynamic)', '1x Adapta Point on all other purchases', 'Bonus categories adjust automatically to your spending', 'No annual fee · Estimate assumes grocery, dining & gas as your top 3']::text[], 58
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-adapta-student', 'CIBC Adapta Mastercard for Students', 'CIBC', 0, 0.015, 0.015, 0.015, 0.02, 0.01, '🎓 Student Adaptive', '#C41230', '2x Adapta on travel via CIBC by Expedia. 1.5x on your top 3 spend categories each month. 1x else. For students.', '/cards/cibc-adapta.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/adapta-mastercard.html', ARRAY['2x Adapta Points on travel booked via CIBC by Expedia', '1.5x Adapta Points on your top 3 spend categories each month (dynamic)', '1x Adapta Point on all other purchases', 'No annual fee · No minimum income required', 'Estimate assumes grocery, dining & gas as your top 3']::text[], 59
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aventura-student', 'CIBC Aventura Visa for Students', 'CIBC', 0, 0.005, 0.01, 0.01, 0.01, 0.005, '🎓 Student Aventura', '#C41230', '1x Aventura on gas, EV, groceries, drugstores & travel. 1 pt per $2 on everything else. For students.', '/cards/cibc-aventura-visa.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/aventura-visa.html', ARRAY['1x Aventura Point on gas, EV charging, groceries & drugstores', '1x Aventura Point on travel booked via CIBC Rewards Centre (Expedia)', '1 Aventura Point per $2 on all other purchases', 'No annual fee · No minimum income required', 'Up to 10¢/L off eligible gas']::text[], 60
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aeroplan-student', 'CIBC Aeroplan Visa for Students', 'CIBC', 0, 0.0067, 0.01, 0.01, 0.01, 0.0067, '🎓 Student Aeroplan', '#C41230', '1x Aeroplan on gas, EV, groceries & Air Canada. 1 pt per $1.50 on everything else. For students.', '/cards/cibc_areoplane_visa.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/aeroplan.html', ARRAY['1x Aeroplan Point on gas, EV charging, groceries & Air Canada purchases', '1 Aeroplan Point per $1.50 on all other purchases', 'Earn points twice at 150+ Aeroplan partners & 170+ online retailers via Aeroplan eStore', 'No annual fee · No minimum income required', 'Up to 10¢/L off gas with Journie Rewards']::text[], 61
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-classic-student', 'CIBC Classic Visa for Students', 'CIBC', 0, 0, 0, 0, 0, 0, '🎓 Student Starter', '#C41230', 'No-fee CIBC Visa for students with purchase security & extended protection. No rewards.', '/cards/cibc-classic-visa.avif', 'https://www.cibc.com/en/personal-banking/credit-cards.html', ARRAY['No annual fee', 'Purchase Security & Extended Protection', 'No minimum income required', 'No rewards or cashback', 'Great for building credit as a student']::text[], 62
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-dividend-infinite', 'CIBC Dividend Visa Infinite', 'CIBC', 120, 0.02, 0.04, 0.04, 0.02, 0.01, '💵 4% Cashback', '#C41230', '4% cashback on gas, EV & groceries. 2% on transport, dining, recurring bills & travel. 1% everything else.', '/cards/cibc-dividend-infinite.webp', 'https://www.cibc.com/en/personal-banking/credit-cards/dividend-visa-infinite.html', ARRAY['4% cashback on gas, EV charging & groceries', '2% on transportation, dining, recurring payments & travel via CIBC by Expedia', '1% cashback on everything else', 'Up to 10¢/L off gas with Journie Rewards', '$120/yr annual fee']::text[], 63
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-dividend-platinum', 'CIBC Dividend Platinum Visa', 'CIBC', 99, 0.02, 0.03, 0.03, 0.02, 0.01, '💵 3% Cashback', '#C41230', '3% cashback on gas, EV & groceries. 2% on transport, dining, recurring bills & travel. 1% everything else.', '/cards/cibc-dividend-platinum.webp', 'https://www.cibc.com/en/personal-banking/credit-cards/dividend-platinum-visa.html', ARRAY['3% cashback on gas, EV charging & groceries', '2% on transportation, dining, recurring payments & travel via CIBC by Expedia', '1% cashback on everything else', 'Up to 10¢/L off gas with Journie Rewards', '$99/yr annual fee']::text[], 64
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-costco', 'CIBC Costco Mastercard', 'CIBC', 0, 0.03, 0.01, 0.02, 0.01, 0.01, '🏪 Costco Card', '#C41230', '3% at restaurants & Costco gas. 2% at other gas, EV & Costco.ca. 1% everything else incl in-warehouse Costco.', '/cards/cibc-costco.png', 'https://www.cibc.com/en/personal-banking/credit-cards/costco-mastercard.html', ARRAY['3% cashback at restaurants & Costco gas', '2% at other gas stations, EV charging & Costco.ca', '1% on all other purchases including in-warehouse Costco', 'No annual fee (Costco membership required)', 'Accepted everywhere Mastercard is accepted']::text[], 65
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-dividend-visa', 'CIBC Dividend Visa', 'CIBC', 0, 0.01, 0.02, 0.01, 0.01, 0.005, '💸 No-Fee Cashback', '#C41230', '2% cashback on groceries. 1% on gas, EV, transport, dining, bills & travel. 0.5% everything else. No fee.', '/cards/cibc-dividend-visa.webp', 'https://www.cibc.com/en/personal-banking/credit-cards/dividend-visa.html', ARRAY['2% cashback on groceries', '1% on gas, EV charging, transportation, dining, recurring payments & travel via CIBC by Expedia', '0.5% cashback on everything else', 'Up to 10¢/L off gas with Journie Rewards', 'No annual fee']::text[], 66
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aeroplan-infinite', 'CIBC Aeroplan Visa Infinite', 'CIBC', 139, 0.01, 0.015, 0.015, 0.015, 0.01, '✈️ Aeroplan Miles', '#C41230', '1.5x Aeroplan on gas, EV, groceries & Air Canada. 1x on everything else.', '/cards/cibc-aeroplan-infinite.webp', 'https://www.cibc.com/en/personal-banking/credit-cards/aeroplan-visa-infinite.html', ARRAY['1.5x Aeroplan Points on gas, EV charging, groceries & Air Canada purchases', '1x Aeroplan Point on all other purchases', 'Earn points twice at 150+ Aeroplan partners & 170+ online retailers via Aeroplan eStore', 'Up to 10¢/L off eligible gas', '$139/yr annual fee']::text[], 67
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aeroplan-privilege', 'CIBC Aeroplan Visa Infinite Privilege', 'CIBC', 599, 0.015, 0.015, 0.015, 0.015, 0.0125, '✈️ Aeroplan Elite', '#C41230', '2x Aeroplan on Air Canada. 1.5x on gas, EV, groceries, travel & dining. 1.25x on everything else.', '/cards/cibc_aeroplane_ifinite_privilge.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/aeroplan-visa-infinite-privilege.html', ARRAY['2x Aeroplan Points on Air Canada & Air Canada Vacations', '1.5x Aeroplan Points on gas, EV charging, groceries, travel & dining', '1.25x Aeroplan Points on all other purchases', 'Earn points twice at 150+ Aeroplan partners & 170+ online retailers · Up to 10¢/L off gas with Journie', 'Priority boarding · Lounge access · $599/yr annual fee']::text[], 68
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-aeroplan-no-fee', 'CIBC Aeroplan Visa', 'CIBC', 0, 0.0067, 0.01, 0.01, 0.01, 0.0067, '✈️ No-Fee Aeroplan', '#C41230', '1x Aeroplan on gas, EV, groceries & Air Canada. 1 pt per $1.50 on everything else. No annual fee.', '/cards/cibc_areoplane_visa.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/aeroplan.html', ARRAY['1x Aeroplan Point on gas, EV charging, groceries & Air Canada purchases', '1 Aeroplan Point per $1.50 on all other purchases', 'Earn points twice at 150+ Aeroplan partners & 170+ online retailers via Aeroplan eStore', 'Up to 10¢/L off gas with Journie Rewards', 'No annual fee']::text[], 69
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-select', 'CIBC Select Visa', 'CIBC', 29, 0, 0, 0, 0, 0, '📉 Low Interest', '#C41230', 'Low purchase & cash advance interest rate. No rewards. Best for carrying a balance.', '/cards/cibc_select_visa.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/select-visa.html', ARRAY['Low purchase interest rate', 'Low cash advance interest rate', 'No rewards or cashback', 'Low balance transfer option', '$29/yr annual fee']::text[], 70
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-classic', 'CIBC Classic Visa', 'CIBC', 0, 0, 0, 0, 0, 0, '🌱 Starter Card', '#C41230', 'Basic no-fee CIBC Visa with purchase security & extended protection. No rewards.', '/cards/cibc-classic-visa.avif', 'https://www.cibc.com/en/personal-banking/credit-cards.html', ARRAY['No annual fee', 'Purchase Security & Extended Protection', 'No rewards or cashback', 'Fraud protection', 'Good for building credit']::text[], 71
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'nbc-world-elite', 'National Bank World Elite Mastercard', 'National Bank', 150, 0.05, 0.05, 0.02, 0.02, 0.01, '🛒 Grocery & Dining', '#ED1C24', '5x points on groceries & restaurants. 2x on gas, EV, bills & À la Carte Travel. 1x everything else.', '/cards/nbc-world-elite.png', 'https://www.nbc.ca/personal/credit-cards/world-elite-mastercard.html', ARRAY['5x points on groceries & restaurants', '2x on gas, EV charging, recurring bills & À la Carte Travel', '1x points on all other purchases', 'Airport lounge access · Comprehensive travel insurance', '$150/yr annual fee']::text[], 72
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'nbc-world', 'National Bank Platinum Mastercard', 'National Bank', 70, 0.02, 0.02, 0.015, 0.015, 0.0067, '💳 Platinum Points', '#ED1C24', '2x points on groceries & restaurants. 1.5x on gas, EV, bills & À la Carte Travel. 1 pt per $1.50 else.', '/cards/nbc-world.png', 'https://www.nbc.ca/personal/credit-cards.html', ARRAY['2x points on groceries & restaurants', '1.5x on gas, EV charging, recurring bills & À la Carte Travel', '1 point per $1.50 on all other purchases', 'Travel insurance included', '$70/yr annual fee']::text[], 73
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'nbc-world-mastercard', 'National Bank World Mastercard', 'National Bank', 115, 0.02, 0.02, 0.01, 0.01, 0.01, '💳 World Points', '#ED1C24', 'Up to 2 points per $1 spent. Conditions apply. À la Carte Rewards program.', '/cards/nbc-world-mastercard.png', 'https://www.nbc.ca/personal/credit-cards.html', ARRAY['Up to 2 points per $1 on eligible purchases (conditions apply)', '1 point per $1 base earn', 'À la Carte Rewards redemption', 'Travel insurance included', '$115/yr annual fee']::text[], 74
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'nbc-allure', 'National Bank Allure Mastercard', 'National Bank', 0, 0.005, 0.01, 0.01, 0.005, 0.01, '💸 No-Fee Cashback', '#ED1C24', 'Up to 1% cashback on gas, groceries & online purchases. No annual fee.', '/cards/nbc-allure.png', 'https://www.nbc.ca/personal/credit-cards.html', ARRAY['Up to 1% cashback on gas, groceries & online purchases', 'Cashback on everyday spending', 'No annual fee', 'No minimum income required', 'Mastercard benefits & protections']::text[], 75
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'nbc-mycredit', 'National Bank mycredit Mastercard', 'National Bank', 0, 0.01, 0.01, 0.005, 0.005, 0.005, '💸 No-Fee Cashback', '#ED1C24', 'Up to 1% cashback. Mobile device & extended warranty protection. No annual fee.', '/cards/nbc-mycredit.png', 'https://www.nbc.ca/personal/credit-cards.html', ARRAY['Up to 1% cashback on eligible purchases (conditions apply)', 'Mobile device insurance (theft/damage up to 2 years)', 'Up to double the manufacturer warranty', 'No annual fee', 'No minimum income required']::text[], 76
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'nbc-echo', 'National Bank ECHO Cashback Mastercard', 'National Bank', 0, 0.005, 0.015, 0.015, 0.005, 0.015, '💸 No-Fee Cashback', '#ED1C24', 'Up to 1.5% cashback on gas, groceries & online purchases. No annual fee.', '/cards/nbc-echo.png', 'https://www.nbc.ca/personal/credit-cards.html', ARRAY['Up to 1.5% cashback on gas, groceries & online purchases', 'Cashback on everyday spending', 'No annual fee', 'Purchase security', 'Mastercard benefits & protections']::text[], 77
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'nbc-syncro', 'National Bank Syncro Mastercard', 'National Bank', 35, 0, 0, 0, 0, 0, '📉 Low Interest', '#ED1C24', 'Low purchase interest rate, plus a low rate on balance transfers & cash advances. No rewards.', '/cards/nbc-syncro.png', 'https://www.nbc.ca/personal/credit-cards.html', ARRAY['Low purchase interest rate', 'Low rate on balance transfers & cash advances', 'No rewards or cashback', 'Low-interest focus', '$35/yr annual fee']::text[], 78
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'desjardins-flexi', 'Desjardins Flexi Visa', 'Desjardins', 0, 0, 0, 0, 0, 0, '📉 Low Interest', '#009A44', 'Low purchase interest rate, plus a low rate on cash advances. No rewards. No annual fee.', '/cards/desjardins-flexi.webp', 'https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html', ARRAY['Low interest rate on purchases', 'Low interest rate on cash advances', 'No rewards or cashback', 'No annual fee', 'Low-interest focus']::text[], 79
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'desjardins-cashback-visa', 'Desjardins Cash Back Visa', 'Desjardins', 0, 0.02, 0.005, 0.005, 0.02, 0.005, '💸 Cash Back', '#009A44', 'Up to 2% on restaurants, entertainment, alternative transport & pre-authorized payments. 0.5% else. No fee.', '/cards/desjardins-cashback-visa.webp', 'https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html', ARRAY['Up to 2% cashback on restaurants', '2% cashback on entertainment', '2% cashback on alternative transportation (transit, rideshare)', 'Up to 2% on pre-authorized payments', '0.5% on all other purchases · No annual fee']::text[], 80
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'desjardins-cashback-mc', 'Desjardins Cash Back Mastercard', 'Desjardins', 0, 0.02, 0.005, 0.005, 0.02, 0.005, '💸 Cash Back', '#009A44', 'Up to 2% on restaurants, entertainment, alternative transport & pre-authorized payments. 0.5% else. No fee.', '/cards/desjardins-cashback-mc.webp', 'https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html', ARRAY['Up to 2% cashback on restaurants', '2% cashback on entertainment', '2% cashback on alternative transportation (transit, rideshare)', 'Up to 2% on pre-authorized payments', '0.5% on all other purchases · No annual fee']::text[], 81
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'desjardins-bonus-visa', 'Desjardins Bonus Visa', 'Desjardins', 0, 0.02, 0.005, 0.005, 0.02, 0.005, '💰 BONUSDOLLARS', '#009A44', 'Up to 2% in BONUSDOLLARS on restaurants, entertainment, alternative transport & pre-auth payments. 0.5% else.', '/cards/desjardins-bonus-visa.webp', 'https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html', ARRAY['Up to 2% BONUSDOLLARS on restaurants', '2% BONUSDOLLARS on entertainment', '2% BONUSDOLLARS on alternative transportation (transit, rideshare)', 'Up to 2% on pre-authorized payments', '0.5% on all other purchases · No annual fee']::text[], 82
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'desjardins-odyssey-world', 'Desjardins Odyssey World Elite Mastercard', 'Desjardins', 130, 0.03, 0.03, 0.01, 0.02, 0.01, '🌍 Quebec Top Card', '#009A44', 'Up to 3% on groceries & restaurants, 2% on entertainment, alternative transport & travel. 1% else. BONUSDOLLARS.', '/cards/desjardins-odyssey-world.jpeg', 'https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html', ARRAY['Up to 3% BONUSDOLLARS on groceries', 'Up to 3% on restaurants', '2% on entertainment & alternative transportation', 'Up to 2% on travel', '1% on all other purchases · $130/yr annual fee']::text[], 83
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'desjardins-odyssey', 'Desjardins Odyssey Gold Visa', 'Desjardins', 110, 0.02, 0.0065, 0.0065, 0.02, 0.0065, '✈️ BONUSDOLLARS', '#009A44', 'Up to 2% on restaurants, entertainment, alternative transport, pre-auth & travel. 0.65% else.', '/cards/desjardins-odyssey.webp', 'https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html', ARRAY['Up to 2% BONUSDOLLARS on restaurants', '2% on entertainment & alternative transportation', 'Up to 2% on pre-authorized payments', 'Up to 2% on travel', '0.65% on all other purchases · $110/yr annual fee']::text[], 84
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'desjardins-cash-world', 'Desjardins Cash Back World Elite Mastercard', 'Desjardins', 100, 0.03, 0.04, 0.01, 0.03, 0.01, '🛒 4% Groceries', '#009A44', 'Up to 4% on groceries, up to 3% on restaurants, 3% on entertainment & alternative transport. 1% else.', '/cards/desjardins-cash-world.webp', 'https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html', ARRAY['Up to 4% cashback on groceries', 'Up to 3% cashback on restaurants', '3% cashback on entertainment', '3% cashback on alternative transportation (transit, rideshare)', '1% on all other purchases · $100/yr annual fee']::text[], 85
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'desjardins-visa-infinite', 'Desjardins Odyssey Visa Infinite Privilege', 'Desjardins', 295, 0.04, 0.03, 0.015, 0.03, 0.015, '💎 Premium BONUSDOLLARS', '#009A44', '4% on restaurants, 3% on groceries, 4% on entertainment & alt transport, up to 3% travel. 1.5% else.', '/cards/desjardins-odyssey-privilege.webp', 'https://www.desjardins.com/ca/personal/accounts-services/credit-cards.html', ARRAY['4% BONUSDOLLARS on restaurants', '3% on groceries', '4% on entertainment & alternative transportation', 'Up to 3% on travel · 1.5% on everything else', '$295/yr Desjardins members ($395 non-members)']::text[], 86
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'mbna-rewards-world-elite', 'MBNA Rewards World Elite Mastercard', 'MBNA', 120, 0.05, 0.05, 0.01, 0.01, 0.01, '🛒 5x Categories', '#003087', '5x points on restaurants, groceries, digital media, memberships & utilities. 1x everything else.', '/cards/mbna-creditcard-rewards-world-elite.png', 'https://www.mbna.ca/en/credit-cards.html', ARRAY['5x points on restaurants, groceries, digital media, memberships & household utilities (until $50k/category/yr)', '1x point on all other purchases', 'Annual Birthday Bonus: 10% of prior-year points (max 15,000)', 'World Elite Mastercard benefits', '$120/yr annual fee']::text[], 87
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'mbna-rewards-platinum', 'MBNA Rewards Platinum Plus Mastercard', 'MBNA', 0, 0.02, 0.02, 0.01, 0.01, 0.01, '🆓 No-Fee Points', '#003087', '2x points on restaurants, groceries, digital media, memberships & utilities. 1x else. 4x intro for 90 days.', '/cards/MBNA-credit-card-mbna-rewards.png', 'https://www.mbna.ca/en/credit-cards.html', ARRAY['2x points on restaurants, groceries, digital media, memberships & household utilities (up to $10k/category/yr)', '4x points on those categories for the first 90 days', '1x point on all other purchases', 'Annual Birthday Bonus: 10% of prior-year points (max 10,000)', 'No annual fee']::text[], 88
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'mbna-true-line', 'MBNA True Line Mastercard', 'MBNA', 0, 0, 0, 0, 0, 0, '📉 Low Interest', '#003087', 'Low purchase interest rate. No rewards. No annual fee. Best for carrying a balance.', '/cards/MBNA-true-line.png', 'https://www.mbna.ca/en/credit-cards.html', ARRAY['Low purchase interest rate', 'No annual fee', 'No rewards or cashback', 'Balance transfer option', 'Low-interest focus']::text[], 89
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'mbna-true-line-gold', 'MBNA True Line Gold Mastercard', 'MBNA', 39, 0, 0, 0, 0, 0, '📉 Lowest Rate', '#003087', 'MBNA’s lowest purchase interest rate, plus a low rate on balance transfers. No rewards.', '/cards/MBNA_true-line-gold.png', 'https://www.mbna.ca/en/credit-cards.html', ARRAY['MBNA’s lowest purchase interest rate', 'Low rate on balance transfers', 'No rewards or cashback', 'Low-interest focus', '$39/yr annual fee']::text[], 90
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'mbna-smart-cash', 'MBNA Smart Cash Platinum Plus Mastercard', 'MBNA', 0, 0.005, 0.02, 0.02, 0.005, 0.005, '⛽ Gas & Grocery', '#003087', '2% cashback on gas & groceries ($500/mo cap). 0.5% on everything else. No annual fee.', '/cards/mbna_smart-cash.png', 'https://www.mbna.ca/en/credit-cards.html', ARRAY['2% cashback on gas & groceries (up to $500 monthly spend per category)', '0.5% cashback on all other eligible purchases', 'No annual fee', 'Automatic cashback', 'Mastercard benefits']::text[], 91
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'mbna-smart-cash-world', 'MBNA Smart Cash World Mastercard', 'MBNA', 39, 0.01, 0.02, 0.02, 0.01, 0.01, '⛽ Gas & Grocery', '#003087', '2% cashback on gas & groceries. 1% on everything else. Includes rental car coverage.', '/cards/MBNA-smart-cash-world.png', 'https://www.mbna.ca/en/credit-cards.html', ARRAY['2% cashback on gas & groceries', '1% cashback on all other eligible purchases', 'Rental Vehicle Collision Damage Waiver', 'World Mastercard benefits', '$39/yr annual fee']::text[], 92
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'mbna-amazon', 'Amazon.ca Rewards Mastercard', 'MBNA', 0, 0.01, 0.01, 0.01, 0.01, 0.015, '🛒 Amazon Cashback', '#FF9900', 'Prime: 2.5% at Amazon.ca & Whole Foods. Non-Prime: 1.5%. Always 1% everywhere else. No annual fee.', '/cards/amazon-mastercard.jpeg', 'https://www.amazon.ca/credit-card', ARRAY['Prime members: 2.5% at Amazon.ca & Whole Foods + 2.5% on foreign currency', 'Non-Prime: 1.5% at Amazon.ca & Whole Foods + 1% on foreign currency', 'Always 1% everywhere else Mastercard is accepted', 'No annual fee', 'Foreign currency cashback offsets FX fees']::text[], 93
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'pc-world-elite', 'PC World Elite Mastercard', 'PC Financial', 0, 0.01, 0.03, 0.02, 0.01, 0.01, '🛒 PC Optimum', '#CC0000', '3% back at Loblaws grocery, 4.5% at Shoppers, 3¢/L at Esso & Mobil. 1% on dining, transit & else.', '/cards/pc-world-elite.webp', 'https://www.pcfinancial.ca/en/credit-cards/', ARRAY['3% back in PC Optimum points at Loblaws-banner grocery stores', '4.5% back at Shoppers Drug Mart & Pharmaprix', 'At least 3¢/L back at Esso & Mobil stations', '3% back at Joe Fresh', '1% on dining, transit & everywhere else · No annual fee']::text[], 94
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'pc-insiders', 'PC Insiders World Elite Mastercard', 'PC Financial', 120, 0.01, 0.04, 0.045, 0.01, 0.01, '🛒 PC Insiders', '#CC0000', '4% at Loblaws grocery (+2% pickup), up to 7¢/L at Esso & Mobil, 5% at Shoppers. 1% on dining & else.', '/cards/pc-insiders.png', 'https://www.pcfinancial.ca/en/credit-cards/', ARRAY['4% back at Loblaws-banner grocery stores (+2% on eligible pickup orders)', 'Up to 7¢/L back at Esso & Mobil stations', '5% back at Shoppers Drug Mart & Pharmaprix', '4% back at Joe Fresh', '1% on dining, transit & everywhere else · $120/yr annual fee']::text[], 95
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'pc-world', 'PC World Mastercard', 'PC Financial', 0, 0.01, 0.02, 0.02, 0.01, 0.01, '🛒 PC Optimum', '#CC0000', '2% back at Loblaws grocery, 3.5% at Shoppers, 3¢/L at Esso & Mobil. 1% on dining, transit & else.', '/cards/pc-world.webp', 'https://www.pcfinancial.ca/en/credit-cards/', ARRAY['2% back in PC Optimum points at Loblaws-banner grocery stores', '3.5% back at Shoppers Drug Mart & Pharmaprix', 'At least 3¢/L back at Esso & Mobil stations', '2% back at Joe Fresh', '1% on dining, transit & everywhere else · No annual fee']::text[], 96
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'pc-mastercard', 'PC Mastercard', 'PC Financial', 0, 0.01, 0.01, 0.02, 0.01, 0.01, '🛒 Entry PC Card', '#CC0000', '1% back at Loblaws grocery, 2.5% at Shoppers, 3¢/L at Esso & Mobil. 1% on dining, transit & else.', '/cards/pc-mastercard.webp', 'https://www.pcfinancial.ca/en/credit-cards/', ARRAY['1% back in PC Optimum points at Loblaws-banner grocery stores', '2.5% back at Shoppers Drug Mart & Pharmaprix', 'At least 3¢/L back at Esso & Mobil stations', '1% back at Joe Fresh', '1% on dining, transit & everywhere else · No annual fee']::text[], 97
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'brim-world-elite', 'Brim World Elite Mastercard', 'Brim Financial', 89, 0.01, 0.01, 0.01, 0.01, 0.01, '💳 Brim Rewards', '#1A1A2E', '1 Brim point per $1 on all purchases. Premium World Elite benefits.', '/cards/brim.png', 'https://www.brimfinancial.com/', ARRAY['1 Brim point per $1 on all purchases', 'World Elite Mastercard benefits', 'Instalment plans', 'Modern app experience', '$89/yr annual fee']::text[], 98
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'brim', 'Brim Mastercard', 'Brim Financial', 0, 0.005, 0.005, 0.005, 0.005, 0.005, '🆓 No-Fee Brim', '#1A1A2E', '1 Brim point per $2 on all purchases. No annual fee. 1.5% foreign transaction fee.', '/cards/brim.png', 'https://www.brimfinancial.com/', ARRAY['1 Brim point per $2 on all purchases', 'No annual fee', '1.5% foreign transaction fee', 'Easy instalment plans', 'Modern app experience']::text[], 99
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rogers-world-elite', 'Rogers Red World Elite Mastercard', 'Rogers Bank', 0, 0.02, 0.02, 0.02, 0.02, 0.02, '📱 2% Cashback', '#DA291C', '2% cashback on all purchases (with a Rogers/Fido/Shaw service), 3% on USD. Effectively 3% redeemed on Rogers bills. No fee.', '/cards/rogers-world-elite.png', 'https://www.rogersbank.com/en/rogers_world_elite_mastercard', ARRAY['2% cashback on all eligible purchases (with a qualifying Rogers, Fido, Shaw or Comwave service)', '1.5% cashback without a qualifying service', '3% cashback on US-dollar purchases', '1.5x redemption bonus = effective 3% when applied to Rogers/Fido bills or hardware', '5 free Roam Like Home days/yr (up to $90 value) · No annual fee']::text[], 100
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'rogers-red', 'Rogers Red Mastercard', 'Rogers Bank', 0, 0.02, 0.02, 0.02, 0.02, 0.02, '📱 2% Cashback', '#DA291C', '2% cashback on all purchases with a Rogers/Fido/Shaw service (1% without). 2% on US-dollar purchases. No fee.', '/cards/rogers-red.png', 'https://www.rogersbank.com/en/rogers_red_mastercard', ARRAY['2% cashback on all eligible purchases (with a qualifying Rogers, Fido, Shaw or Comwave service)', '1% cashback without a qualifying service', '2% cashback on US-dollar purchases', 'Redeem against Rogers/Fido bills or at checkout', 'No annual fee']::text[], 101
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'triangle-world-elite', 'Triangle World Elite Mastercard', 'Canadian Tire', 0, 0.01, 0.03, 0.03, 0.01, 0.01, '🍁 CT Money', '#E3141B', '4% CT Money at Canadian Tire stores, 5-7¢/L at Gas+ & Petro-Canada, 3% at groceries. 1% else.', '/cards/canadian_tire_world_elite_mastercard.webp', 'https://www.canadiantire.ca/en/credit-services/triangle-world-elite-mastercard.html', ARRAY['4% CT Money at Canadian Tire, Sport Chek, Mark''s, Atmosphere & partner stores', '7¢/L on premium fuel, 5¢/L on other fuel at Gas+ & Petro-Canada', '3% CT Money at grocery stores (first $12k/yr; excl Costco & Walmart)', '1% CT Money everywhere else · Redeem $1 for $1', 'No annual fee · Weekly personalized offers up to 25x']::text[], 102
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'triangle', 'Triangle Mastercard', 'Canadian Tire', 0, 0.005, 0.015, 0.03, 0.005, 0.005, '🍁 CT Money', '#E3141B', '4% CT Money at Canadian Tire family stores, 5¢/L at Gas+ & Petro-Canada, 1.5% at groceries. 0.5% else.', '/cards/canadian_tire_spot-triangle-mastercard.webp', 'https://www.canadiantire.ca/en/credit-services/triangle-mastercard.html', ARRAY['4% CT Money at Canadian Tire, Sport Chek, Mark''s, Atmosphere & partner stores', '5¢/L CT Money at Gas+ & Petro-Canada fuel', '1.5% CT Money at grocery stores (first $12k/yr; excl Costco & Walmart)', '0.5% CT Money everywhere else · Redeem $1 for $1', 'No annual fee · Weekly personalized offers up to 25x']::text[], 103
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'tangerine-world', 'Tangerine Money-Back World Mastercard', 'Tangerine', 0, 0.02, 0.02, 0.02, 0.005, 0.005, '💸 Choose Your 2%', '#FF6600', '2% unlimited cashback in up to 3 categories you choose. 0.5% on everything else. World Mastercard benefits. No fee.', '/cards/tangerine-world.png', 'https://www.tangerine.ca/en/products/spending/creditcard', ARRAY['2% unlimited cashback in 2 categories of your choice', 'Unlock a 3rd 2% category by depositing cashback into a Tangerine Savings Account', '0.5% cashback on everything else', 'World Mastercard benefits (mobile device insurance, rental car coverage)', 'No annual fee · Estimate assumes grocery, dining & gas as your picks']::text[], 104
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'tangerine-rewards-world-elite', 'Tangerine Rewards World Elite Mastercard', 'Tangerine', 120, 0.015, 0.015, 0.015, 0.01, 0.01, '🎬 Scene+ Boost', '#FF6600', '1.5x Scene+ on 3 chosen Accelerator categories (switch every 90 days). 1x else. Up to 10¢/L at Shell.', '/cards/tangerine-rewards-world-elite.webp', 'https://www.tangerine.ca/en/products/spending/creditcard', ARRAY['1.5x Scene+ points on 3 chosen Accelerator categories (switchable every 90 days)', '1x Scene+ point per $1 on everything else', 'Up to 10¢/L in value on fuel at participating Shell stations', 'Airport lounge passes & travel insurances', '$120/yr annual fee · Estimate assumes grocery, dining & gas as your picks']::text[], 105
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'tangerine-money-back', 'Tangerine Money-Back Credit Card', 'Tangerine', 0, 0.02, 0.02, 0.02, 0.005, 0.005, '💸 Choose Your 2%', '#FF6600', '2% unlimited cashback in up to 3 categories you choose. 0.5% on everything else. No annual fee.', '/cards/tangerine-money-back.jpg', 'https://www.tangerine.ca/en/products/spending/creditcard', ARRAY['2% unlimited cashback in 2 categories of your choice', 'Unlock a 3rd 2% category by depositing cashback into a Tangerine Savings Account', '0.5% cashback on everything else', 'No annual fee · No cashback limit', 'Estimate assumes grocery, dining & gas as your picks']::text[], 106
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'simplii-cashback', 'Simplii Financial Cash Back Visa', 'Simplii Financial', 0, 0.04, 0.015, 0.015, 0.005, 0.005, '🍽️ 4% Dining', '#CC0000', '4% on restaurants, bars & coffee shops. 1.5% on gas, groceries, drugstore & bills. 0.5% else. No fee.', '/cards/simplii.webp', 'https://www.simplii.com/en/credit-cards.html', ARRAY['4% cashback on restaurants, bars & coffee shops (up to $5k/yr)', '1.5% on gas, groceries, drugstore & pre-authorized payments (up to $15k/yr)', '0.5% on all other purchases (no limit)', 'No annual fee', 'Monthly cashback deposit']::text[], 107
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'atb-gold-cash', 'ATB Gold Cash Rewards Mastercard', 'ATB Financial', 0, 0.02, 0.02, 0.01, 0.005, 0.01, '🌾 Cash Rewards', '#004B8D', '2% on groceries, dining, streaming & subscriptions. 1% on gas & online. 0.5% else. No annual fee.', '/cards/atb_gold_mastercard.png', 'https://www.atb.com/personal/bank/credit-cards/', ARRAY['2% cashback on groceries, dining, digital streaming & subscriptions', '1% cashback on gas & online/in-app purchases (as primary card on file)', '0.5% unlimited cashback on everything else', 'No annual fee', 'ATB banking integration']::text[], 108
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'atb-world-elite', 'ATB World Elite Mastercard', 'ATB Financial', 120, 0.01, 0.03, 0.03, 0.04, 0.01, '🌾 Travel Rewards', '#004B8D', '8x points (4%) on travel, 6x (3%) on groceries, gas, streaming & entertainment. 2x (1%) on everything else.', '/cards/atb-world-elite.png', 'https://www.atb.com/personal/bank/credit-cards/', ARRAY['8 My Rewards points per $1 on airlines, hotels, motels & car rentals', '6 My Rewards points per $1 on groceries, gas, streaming & entertainment', '2 My Rewards points per $1 on all other purchases', 'World Elite Mastercard benefits & travel insurance', '$120/yr annual fee']::text[], 109
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'atb-mastercard', 'ATB Gold My Rewards Mastercard', 'ATB Financial', 0, 0.0075, 0.015, 0.015, 0.0075, 0.0075, '🌾 My Rewards', '#004B8D', '3x points (1.5%) on groceries, gas, streaming, subscriptions & entertainment. 1.5x on everything else. No fee.', '/cards/atb_gold_mastercard.png', 'https://www.atb.com/personal/bank/credit-cards/', ARRAY['3 My Rewards points per $1 on groceries, gas, digital streaming, subscriptions & entertainment', '1.5 My Rewards points per $1 on all other purchases', 'Unlimited rewards earning', 'No annual fee', 'ATB My Rewards program']::text[], 110
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'neo-world-elite', 'Neo World Mastercard', 'Neo Financial', 0, 0.005, 0.02, 0.02, 0.005, 0.005, '🚀 Fintech Cashback', '#7B2D8B', '2% on groceries, gas & recurring payments. 0.5% on everything else. Variable partner cashback. No fee.', '/cards/neo_world_elite_mastercard.avif', 'https://www.neofinancial.com/credit-card', ARRAY['2% cashback on groceries', '2% cashback on gas', '2% cashback on recurring payments', '0.5% on everything else · Variable cashback at Neo partners', 'No annual fee · Modern banking app']::text[], 111
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'neo-world-elite-mc', 'Neo World Elite Mastercard', 'Neo Financial', 125, 0.01, 0.05, 0.03, 0.01, 0.01, '🚀 Premium Cashback', '#7B2D8B', '5% on groceries, 3% on gas, 4% on recurring payments. 1% on everything else. Variable partner cashback.', '/cards/neo-world-elite.jpeg', 'https://www.neofinancial.com/credit-card', ARRAY['5% cashback on groceries', '3% cashback on gas', '4% cashback on recurring payments', '1% on everything else · Variable cashback at Neo partners', '$125/yr annual fee']::text[], 112
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'neo-mastercard', 'Neo Mastercard', 'Neo Financial', 0, 0.005, 0.01, 0.01, 0.005, 0.005, '🚀 No-Fee Fintech', '#7B2D8B', '1% cashback on groceries & gas. Variable cashback at Neo partner merchants. No annual fee.', '/cards/noe_world_mastercard.avif', 'https://www.neofinancial.com/credit-card', ARRAY['1% cashback on groceries', '1% cashback on gas', 'Average 5% cashback at Neo partner merchants (varies)', 'Guaranteed minimum 0.5% cashback', 'No annual fee · Modern banking app']::text[], 113
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'capital-one-guaranteed', 'Capital One Guaranteed Mastercard', 'Capital One', 0, 0, 0, 0, 0, 0, '🌱 Credit Builder', '#004A97', 'Guaranteed approval credit-building card. No rewards or cashback. No annual fee.', '/cards/capital_one_guaranteed_mastercard.png', 'https://www.capitalone.ca/', ARRAY['Guaranteed approval', 'Build or rebuild your credit', 'No rewards or cashback', 'No annual fee', 'Reports to credit bureaus']::text[], 114
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'capital-one-secured', 'Capital One Guaranteed Secured Mastercard', 'Capital One', 0, 0, 0, 0, 0, 0, '🔒 Secured Builder', '#004A97', 'Secured credit-building card with a refundable deposit. No rewards. No annual fee.', '/cards/capital_one_secured-mastercard-card-art-8fe01f8a08e10e7f06a563278eed22ca.png', 'https://www.capitalone.ca/', ARRAY['Guaranteed approval with a security deposit', 'Build or rebuild your credit', 'No rewards or cashback', 'No annual fee', 'Reports to credit bureaus']::text[], 115
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'capital-one-smart-rewards', 'Capital One Smart Rewards Mastercard', 'Capital One', 0, 0.01, 0.01, 0.01, 0.01, 0.01, '💳 Pay-to-Earn', '#004A97', 'Earn 5 points per $1 paid toward your balance (~1% effective). No annual fee.', '/cards/CAPITAL_ONE_SMART_REWARDS_MASTERCARD.png', 'https://www.capitalone.ca/', ARRAY['5 points per $1 paid toward your balance', 'Rewards earned on payments, not purchases', '~1% effective return when you pay off your spending', 'No annual fee', 'Redeem points for rewards']::text[], 116
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'capital-one-aspire-cash', 'Capital One Aspire Cash Platinum Mastercard', 'Capital One', 0, 0.01, 0.01, 0.01, 0.01, 0.01, '💵 1% Cashback', '#004A97', '1% cash rewards on every $1 spent. No annual fee.', '/cards/capital-one-aspire-cash.png', 'https://www.capitalone.ca/', ARRAY['1% cash rewards on all purchases', 'No annual fee', 'No cap on cash rewards', 'Purchase protections', 'Simple flat-rate cashback']::text[], 117
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'capital-one-aspire', 'Capital One Aspire Travel Platinum Mastercard', 'Capital One', 0, 0.01, 0.01, 0.01, 0.01, 0.01, '✈️ Reward Miles', '#004A97', '1 Reward mile per $1 on all purchases (~1% in travel value). No annual fee.', '/cards/Capital_one_aspire-travel-card-art.png', 'https://www.capitalone.ca/', ARRAY['1 Reward mile per $1 on all purchases', 'Redeem miles for travel (100 miles = $1)', 'No annual fee', 'Travel & purchase protections', 'Flexible travel redemptions']::text[], 118
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'scotiabank-student', 'Scotiabank Scene+ Student Visa', 'Scotiabank', 0, 0.02, 0.01, 0.01, 0.01, 0.01, '🎓 Student Scene+', '#CC0000', 'Scene+ points with no annual fee for students. Great movie rewards.', '/cards/scotia_no_fee_visa.webp', 'https://www.scotiabank.com/ca/en/personal/credit-cards/student.html', ARRAY['2x Scene+ Points on dining & entertainment', '1x Scene+ Point on all other purchases', 'Redeem for movies, travel, food & more', 'No annual fee · No minimum income required', 'Access to Scene+ rewards program']::text[], 119
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();
insert into public.card_catalog (id, name, issuer, annual_fee, dining_rate, grocery_rate, gas_rate, travel_rate, other_rate, badge, color, description, img, bank_url, perks, sort_order) values (
  'cibc-student', 'CIBC Dividend Visa for Students', 'CIBC', 0, 0.01, 0.02, 0.01, 0.01, 0.005, '🎓 Student Cashback', '#C41230', '2% cashback on groceries. 1% on gas, EV, transport, dining, bills & travel. 0.5% else. For students.', '/cards/cibc_dividend_for_students.avif', 'https://www.cibc.com/en/personal-banking/credit-cards/student.html', ARRAY['2% cashback on groceries', '1% on gas, EV charging, transportation, dining, recurring payments & travel via CIBC by Expedia', '0.5% cashback on everything else', 'No annual fee · No minimum income required', 'Build credit as a student']::text[], 120
) on conflict (id) do update set
  name=excluded.name, issuer=excluded.issuer, annual_fee=excluded.annual_fee,
  dining_rate=excluded.dining_rate, grocery_rate=excluded.grocery_rate, gas_rate=excluded.gas_rate,
  travel_rate=excluded.travel_rate, other_rate=excluded.other_rate, badge=excluded.badge,
  color=excluded.color, description=excluded.description, img=excluded.img,
  bank_url=excluded.bank_url, perks=excluded.perks, sort_order=excluded.sort_order, updated_at=now();

