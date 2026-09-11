-- On A Trip Holidays CMS v2
-- Run after supabase/admin-schema.sql in Supabase SQL Editor.

-- Public website can read only published, visible packages.
drop policy if exists "public can read published packages" on public.packages;
create policy "public can read published packages" on public.packages for select using (status='published' and visible=true);

create table if not exists public.itinerary_documents (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.packages(id) on delete cascade,
  title text not null,
  file_url text not null,
  file_type text default 'pdf',
  status text not null default 'draft' check(status in ('draft','review','published','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.packages(id) on delete cascade,
  departure_date date not null,
  return_date date,
  total_seats integer not null default 20,
  sold_seats integer not null default 0,
  pickup_point text,
  reporting_time text,
  vehicle text,
  status text not null default 'open' check(status in ('open','almost_full','full','closed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  original_price text,
  offer_price text,
  discount text,
  start_date date,
  end_date date,
  image text,
  cta_text text default 'Book now',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating integer not null default 5 check(rating between 1 and 5),
  review text not null,
  destination text,
  photo_url text,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  folder text default 'general',
  alt_text text default '',
  created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text default '',
  hero_image text default '',
  seo_title text,
  seo_description text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.itinerary_documents enable row level security;
alter table public.batches enable row level security;
alter table public.offers enable row level security;
alter table public.reviews enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.destinations enable row level security;

create policy "public published itineraries" on public.itinerary_documents for select using(status='published');
create policy "admins manage itineraries" on public.itinerary_documents for all using(is_admin()) with check(is_admin());
create policy "public batches" on public.batches for select using(status in ('open','almost_full','full'));
create policy "admins manage batches" on public.batches for all using(is_admin()) with check(is_admin());
create policy "public active offers" on public.offers for select using(active=true);
create policy "admins manage offers" on public.offers for all using(is_admin()) with check(is_admin());
create policy "public published reviews" on public.reviews for select using(published=true);
create policy "admins manage reviews" on public.reviews for all using(is_admin()) with check(is_admin());
create policy "admins manage media" on public.media_assets for all using(is_admin()) with check(is_admin());
create policy "public site settings" on public.site_settings for select using(true);
create policy "admins manage site settings" on public.site_settings for all using(is_admin()) with check(is_admin());
create policy "public destinations" on public.destinations for select using(published=true);
create policy "admins manage destinations" on public.destinations for all using(is_admin()) with check(is_admin());

create index if not exists batches_package_date_idx on public.batches(package_id,departure_date);
create index if not exists offers_active_idx on public.offers(active,end_date);
create index if not exists reviews_published_idx on public.reviews(published,featured);
