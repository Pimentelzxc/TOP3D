-- Execute no SQL Editor de um projeto Supabase, antes de liberar o painel.
begin;
create schema if not exists top3d_private;
revoke all on schema top3d_private from public, anon, authenticated;
create table if not exists top3d_private.catalog_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table top3d_private.catalog_admins enable row level security;
revoke all on top3d_private.catalog_admins from public, anon, authenticated;

create or replace function public.top3d_is_catalog_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from top3d_private.catalog_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.top3d_is_catalog_admin() from public;
grant execute on function public.top3d_is_catalog_admin() to anon, authenticated;

create table if not exists public.top3d_catalog_products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  category text not null check (category in ('PLA','PLA+','PETG','ABS','ASA','TPU','PLA Silk','PLA Matte','PLA Rainbow','Especial')),
  brand text not null check (brand in ('Multfila','3D Brothers','Voolt3D','3D Prime','ELEGOO')),
  description text not null check (char_length(trim(description)) between 10 and 2000),
  color text check (char_length(color) <= 60),
  weight text check (char_length(weight) <= 40),
  diameter text check (char_length(diameter) <= 40),
  image_path text not null check (image_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  price numeric(10,2) check (price >= 0 and price <= 1000000),
  product_url text check (product_url is null or (product_url ~ '^https://[^[:space:]@]+$' and char_length(product_url) <= 2048)),
  available boolean,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists top3d_catalog_products_public_index on public.top3d_catalog_products (published, created_at desc);
create index if not exists top3d_catalog_products_brand_index on public.top3d_catalog_products (brand);
alter table public.top3d_catalog_products enable row level security;
revoke all on public.top3d_catalog_products from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.top3d_catalog_products to anon;
grant select, insert, update, delete on public.top3d_catalog_products to authenticated;
drop policy if exists catalog_read on public.top3d_catalog_products;
create policy catalog_read on public.top3d_catalog_products for select to anon, authenticated
  using (published = true or (select public.top3d_is_catalog_admin()));
drop policy if exists catalog_insert on public.top3d_catalog_products;
create policy catalog_insert on public.top3d_catalog_products for insert to authenticated
  with check ((select public.top3d_is_catalog_admin()));
drop policy if exists catalog_update on public.top3d_catalog_products;
create policy catalog_update on public.top3d_catalog_products for update to authenticated
  using ((select public.top3d_is_catalog_admin())) with check ((select public.top3d_is_catalog_admin()));
drop policy if exists catalog_delete on public.top3d_catalog_products;
create policy catalog_delete on public.top3d_catalog_products for delete to authenticated
  using ((select public.top3d_is_catalog_admin()));
create or replace function public.top3d_catalog_set_updated_at() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated_at = clock_timestamp(); return new; end; $$;
revoke all on function public.top3d_catalog_set_updated_at() from public, anon, authenticated;
drop trigger if exists top3d_catalog_updated_at on public.top3d_catalog_products;
create trigger top3d_catalog_updated_at before update on public.top3d_catalog_products for each row execute function public.top3d_catalog_set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('top3d-catalog-products','top3d-catalog-products',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true, file_size_limit=5242880, allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists top3d_catalog_photos_read on storage.objects;
create policy top3d_catalog_photos_read on storage.objects for select to anon, authenticated using (bucket_id='top3d-catalog-products');
drop policy if exists top3d_catalog_photos_insert on storage.objects;
create policy top3d_catalog_photos_insert on storage.objects for insert to authenticated
  with check (bucket_id='top3d-catalog-products' and (select public.top3d_is_catalog_admin()) and split_part(name,'/',1)=(select auth.uid())::text);
drop policy if exists top3d_catalog_photos_delete on storage.objects;
create policy top3d_catalog_photos_delete on storage.objects for delete to authenticated
  using (bucket_id='top3d-catalog-products' and (select public.top3d_is_catalog_admin()));
commit;
