-- ============================================================================
-- Climate Comfort — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Admins: any Supabase-authenticated user whose email is in this table
-- gets admin rights (see is_admin() below). Add rows by hand in Table Editor.
-- ----------------------------------------------------------------------------
create table if not exists admin_emails (
    email text primary key
);

create or replace function is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
    select exists (
        select 1 from admin_emails
        where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

-- ----------------------------------------------------------------------------
-- Suppliers (Elit Electronics, Kontakt, ...)
-- ----------------------------------------------------------------------------
create table if not exists suppliers (
    id         uuid primary key default gen_random_uuid(),
    slug       text not null unique,          -- 'elit', 'kontakt'
    name       text not null,                 -- 'Elit Electronics'
    created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Canonical products: ONE row per real-world model, regardless of how many
-- suppliers carry it. brand+model is the identity used for matching imports.
-- display_price / display_old_price are what the storefront shows — they are
-- recalculated on each import from the offers according to the pricing rule.
-- ----------------------------------------------------------------------------
create table if not exists products (
    id              uuid primary key default gen_random_uuid(),
    brand           text not null,            -- 'GORENJE' (uppercased)
    model           text not null,            -- 'MERCURY21' (trimmed, uppercased)
    category        text not null,            -- 'ac' | 'boiler' | 'heater' | ...
    subtype         text,                     -- 'inverter' | 'on_off' | null
    btu             integer,                  -- 9000, 12000 ... null if unknown
    area_sqm        text,                     -- '25-30' (from Kontakt descriptions)
    title_ka        text,
    title_en        text,
    description_ka  text,
    description_en  text,
    image_url       text,                     -- main/cover photo
    images          jsonb not null default '[]'::jsonb, -- full gallery, fetched from supplier site
    specs           jsonb not null default '[]'::jsonb, -- [{group, items:[{name,value}]}], fetched from supplier site
    reference_url   text,                     -- e.g. Elit's EE LINK, admin reference only
    display_price     numeric(10,2),          -- storefront price (chosen by pricing rule)
    display_old_price numeric(10,2),          -- crossed-out price, optional
    is_published    boolean not null default false,
    needs_review    boolean not null default false, -- imported but missing data (e.g. BTU)
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    unique (brand, model)
);

-- added later: safe to re-run against a table that already exists
alter table products add column if not exists images jsonb not null default '[]'::jsonb;
alter table products add column if not exists specs  jsonb not null default '[]'::jsonb;
alter table products add column if not exists stock_status text; -- 'in' | 'low' | null, set by the importer

-- ----------------------------------------------------------------------------
-- Supplier offers: one row per supplier per product. Holds ALL price levels
-- from the price lists, including our cost (dealer price) — this table is
-- ADMIN-ONLY under RLS; the public never sees supplier costs.
-- ----------------------------------------------------------------------------
create table if not exists supplier_offers (
    id                 uuid primary key default gen_random_uuid(),
    product_id         uuid not null references products (id) on delete cascade,
    supplier_id        uuid not null references suppliers (id) on delete cascade,
    supplier_item_code text not null,         -- Elit 'I102628' / Kontakt 'TM-MT-...'
    retail_price       numeric(10,2),         -- supplier's RRP
    action_price       numeric(10,2),         -- supplier's sale price (null = no sale)
    dealer_price       numeric(10,2),         -- OUR cost
    dealer_promo_price numeric(10,2),         -- our promo cost, if any
    stock_hint         text,                  -- raw: '>5', '<5', '10+', '0', '#N/A'
    in_stock           boolean not null default false,
    source_row         jsonb,                 -- raw parsed row, for audit/debugging
    last_seen_at       timestamptz not null default now(),  -- last file that contained it
    updated_at         timestamptz not null default now(),
    unique (supplier_id, supplier_item_code)
);

create index if not exists idx_offers_product  on supplier_offers (product_id);
create index if not exists idx_offers_supplier on supplier_offers (supplier_id);

-- ----------------------------------------------------------------------------
-- Import batches: one row per uploaded Excel, for the audit trail
-- ("who imported what, when, and what changed").
-- ----------------------------------------------------------------------------
create table if not exists import_batches (
    id           uuid primary key default gen_random_uuid(),
    supplier_id  uuid not null references suppliers (id),
    file_name    text,
    imported_by  text,                        -- admin email
    stats        jsonb,                       -- {"new":12,"price_changes":31,"missing":3,"skipped":2}
    created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Orders: written by the storefront at checkout, read by the admin page.
-- Snapshot fields (product_title, amount) are copied at purchase time so the
-- order stays correct even if the product/price changes later.
-- ----------------------------------------------------------------------------
create table if not exists orders (
    id              uuid primary key default gen_random_uuid(),
    order_no        bigint generated always as identity,     -- human-friendly number
    user_id         uuid references auth.users (id),         -- null for guests
    user_email      text not null,
    customer_name   text not null,
    phone           text not null,
    address         text not null,
    personal_id     text,                                    -- 11-digit ID (financing)
    product_id      uuid references products (id),
    product_title   text not null,
    amount          numeric(10,2) not null check (amount >= 0),
    needs_install   boolean not null default false,
    order_type      text not null default 'standard'         -- 'standard' | 'financing'
                    check (order_type in ('standard','financing')),
    payment_method  text,                                    -- 'tbc' | 'bog' | 'cash' | null
    payment_status  text not null default 'pending'
                    check (payment_status in ('pending','paid','failed','refunded')),
    status          text not null default 'new'
                    check (status in ('new','confirmed','delivering','completed','cancelled')),
    created_at      timestamptz not null default now()
);

create index if not exists idx_orders_created on orders (created_at desc);

-- ----------------------------------------------------------------------------
-- updated_at maintenance
-- ----------------------------------------------------------------------------
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_products_touch on products;
create trigger trg_products_touch before update on products
    for each row execute function touch_updated_at();

drop trigger if exists trg_offers_touch on supplier_offers;
create trigger trg_offers_touch before update on supplier_offers
    for each row execute function touch_updated_at();

-- ============================================================================
-- Row Level Security
--   public (anon):  read published products; create orders
--   admins:         everything
--   supplier_offers / import_batches contain OUR COSTS → admin-only
-- ============================================================================
alter table admin_emails    enable row level security;
alter table suppliers       enable row level security;
alter table products        enable row level security;
alter table supplier_offers enable row level security;
alter table import_batches  enable row level security;
alter table orders          enable row level security;

-- admin_emails: admins can read (needed for is_admin() itself via security definer;
-- direct table access restricted to admins so the list isn't public)
drop policy if exists admin_emails_admin on admin_emails;
create policy admin_emails_admin on admin_emails
    for all using (is_admin()) with check (is_admin());

-- suppliers: admin only
drop policy if exists suppliers_admin on suppliers;
create policy suppliers_admin on suppliers
    for all using (is_admin()) with check (is_admin());

-- products: everyone reads published; admins do everything
drop policy if exists products_public_read on products;
create policy products_public_read on products
    for select using (is_published = true or is_admin());

drop policy if exists products_admin_write on products;
create policy products_admin_write on products
    for insert with check (is_admin());
drop policy if exists products_admin_update on products;
create policy products_admin_update on products
    for update using (is_admin()) with check (is_admin());
drop policy if exists products_admin_delete on products;
create policy products_admin_delete on products
    for delete using (is_admin());

-- supplier_offers: admin only (contains dealer/cost prices)
drop policy if exists offers_admin on supplier_offers;
create policy offers_admin on supplier_offers
    for all using (is_admin()) with check (is_admin());

-- import_batches: admin only
drop policy if exists batches_admin on import_batches;
create policy batches_admin on import_batches
    for all using (is_admin()) with check (is_admin());

-- orders: anyone can place one; owners see their own; admins see/update all
drop policy if exists orders_insert_any on orders;
create policy orders_insert_any on orders
    for insert with check (true);

drop policy if exists orders_select_own on orders;
create policy orders_select_own on orders
    for select using (is_admin() or (auth.uid() is not null and user_id = auth.uid()));

drop policy if exists orders_admin_update on orders;
create policy orders_admin_update on orders
    for update using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- Service bookings (installation / dismantling / refill / maintenance):
-- written by the storefront booking form, managed in the admin Bookings tab.
-- ----------------------------------------------------------------------------
create table if not exists service_bookings (
    id             uuid primary key default gen_random_uuid(),
    booking_no     bigint generated always as identity,
    service_type   text not null,          -- 'installation' | 'dismantling' | 'refill' | 'maintenance'
    service_label  text,                   -- human label shown at booking time
    btu_range      text,                   -- '9000-12000' ...
    extras         jsonb,                  -- {"brackets":true,"pipe":false,"dismantle":false}
    preferred_date date,
    time_slot      text,                   -- 'morning' | 'afternoon' | 'evening'
    customer_name  text not null,
    phone          text not null,
    address        text not null,
    notes          text,
    estimated_cost numeric(10,2),
    status         text not null default 'new'
                   check (status in ('new','confirmed','completed','cancelled')),
    created_at     timestamptz not null default now()
);

alter table service_bookings enable row level security;

drop policy if exists bookings_insert_any on service_bookings;
create policy bookings_insert_any on service_bookings
    for insert with check (true);

drop policy if exists bookings_admin_select on service_bookings;
create policy bookings_admin_select on service_bookings
    for select using (is_admin());

drop policy if exists bookings_admin_update on service_bookings;
create policy bookings_admin_update on service_bookings
    for update using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- Customer profiles: one row per Supabase Auth user, holding the delivery and
-- financing details the shopper re-uses between orders.
--
-- The storefront used to keep accounts (passwords included) in localStorage,
-- which meant the account only existed in one browser and the password sat
-- there in plain text. Authentication now belongs to Supabase Auth; this table
-- holds only the non-secret profile that goes with it.
--
-- `cards` stores the last 4 digits and expiry for display convenience only —
-- never a full card number and never a CVV.
-- ----------------------------------------------------------------------------
create table if not exists profiles (
    id          uuid primary key references auth.users (id) on delete cascade,
    email       text,
    first_name  text,
    last_name   text,
    phone       text,
    address     text,
    personal_id text,                                   -- 11-digit ID, for financing
    cards       jsonb not null default '[]'::jsonb,     -- [{last4, brand, expiry, holder}]
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

drop trigger if exists trg_profiles_touch on profiles;
create trigger trg_profiles_touch before update on profiles
    for each row execute function touch_updated_at();

-- Every new auth user gets a profile row automatically, so the storefront
-- never has to branch on "profile missing".
create or replace function handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
    insert into profiles (id, email) values (new.id, new.email)
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user();

alter table profiles enable row level security;

-- A shopper sees and edits only their own profile; admins can read all.
drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own on profiles
    for select using (auth.uid() = id or is_admin());

drop policy if exists profiles_insert_own on profiles;
create policy profiles_insert_own on profiles
    for insert with check (auth.uid() = id);

drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own on profiles
    for update using (auth.uid() = id) with check (auth.uid() = id);

-- Orders are looked up by owner on the account page
create index if not exists idx_orders_user on orders (user_id);

-- Backfill profiles for anyone who signed up before this table existed
insert into profiles (id, email)
select u.id, u.email from auth.users u
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Seed the two suppliers we already have price lists for
-- ----------------------------------------------------------------------------
insert into suppliers (slug, name) values
    ('elit',    'Elit Electronics'),
    ('kontakt', 'Kontakt')
on conflict (slug) do nothing;
