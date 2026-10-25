-- Execute depois de 001_catalog.sql e de criar a conta em Authentication > Users.
-- A senha é criada exclusivamente no Supabase; ela não fica neste repositório.
do $$
declare administrator uuid;
begin
  select id into administrator from auth.users where lower(email) = 'top3d2k26@gmail.com';
  if administrator is null then
    raise exception 'Crie primeiro a conta top3d2k26@gmail.com em Authentication > Users e execute este script novamente.';
  end if;
  insert into top3d_private.catalog_admins(user_id) values(administrator)
  on conflict(user_id) do nothing;
end;
$$;
