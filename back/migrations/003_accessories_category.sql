-- Execute após 001_catalog.sql. Preserva os produtos e as permissões existentes.
begin;

alter table public.top3d_catalog_products
  drop constraint if exists top3d_catalog_products_category_check;

alter table public.top3d_catalog_products
  add constraint top3d_catalog_products_category_check
  check (category in ('PLA','PLA+','PETG','ABS','ASA','TPU','PLA Silk','PLA Matte','PLA Rainbow','Especial','Acessórios'));

commit;
