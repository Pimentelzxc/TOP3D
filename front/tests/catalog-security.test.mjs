import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
// PostgreSQL real em WASM: valida a migração e as políticas, com os schemas
// auth/storage mínimos simulando os contratos do Supabase. Nenhuma chamada à produção.
const db = new PGlite();
await db.exec(`
 create role anon; create role authenticated;
 create schema auth; create table auth.users(id uuid primary key, email text);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to anon, authenticated;
 create schema storage;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(bucket_id text,name text,primary key(bucket_id,name));
 alter table storage.objects enable row level security;
 grant usage on schema storage to anon,authenticated;
 grant select on storage.objects to anon;
 grant select,insert,update,delete on storage.objects to authenticated;
 insert into auth.users values('11111111-1111-4111-8111-111111111111','top3d2k26@gmail.com'),('22222222-2222-4222-8222-222222222222','viewer@example.com');
`);
await db.exec(
  await readFile(
    new URL("../../back/migrations/001_catalog.sql", import.meta.url),
    "utf8",
  ),
);
await db.exec(
  await readFile(
    new URL("../../back/migrations/002_grant_admin.sql", import.meta.url),
    "utf8",
  ),
);
const admin = "11111111-1111-4111-8111-111111111111",
  viewer = "22222222-2222-4222-8222-222222222222";
async function asRole(role, user, action) {
  assert.ok(["anon", "authenticated"].includes(role));
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${role}`);
    await tx.query("select set_config('request.jwt.claim.sub',$1,true)", [
      user || "",
    ]);
    return action(tx);
  });
}
const insert = `insert into public.top3d_catalog_products(name,category,brand,description,image_path,published) values('PLA de teste','PLA','Multfila','Descrição do produto de teste.','11111111-1111-4111-8111-111111111111/33333333-3333-4333-8333-333333333333.webp',$1) returning id`;
let productId;
test("somente a conta autorizada recebe acesso administrativo", async () => {
  assert.equal(
    (
      await asRole("anon", null, (tx) =>
        tx.query("select public.top3d_is_catalog_admin() as admin"),
      )
    ).rows[0].admin,
    false,
  );
  assert.equal(
    (
      await asRole("authenticated", viewer, (tx) =>
        tx.query("select public.top3d_is_catalog_admin() as admin"),
      )
    ).rows[0].admin,
    false,
  );
  assert.equal(
    (
      await asRole("authenticated", admin, (tx) =>
        tx.query("select public.top3d_is_catalog_admin() as admin"),
      )
    ).rows[0].admin,
    true,
  );
});
test("visitantes e usuários comuns não podem cadastrar produtos", async () => {
  await assert.rejects(
    () => asRole("anon", null, (tx) => tx.query(insert, [true])),
    /permission denied/,
  );
  await assert.rejects(
    () => asRole("authenticated", viewer, (tx) => tx.query(insert, [true])),
    /row-level security/,
  );
});
test("rascunhos só aparecem para administradores", async () => {
  productId = (
    await asRole("authenticated", admin, (tx) => tx.query(insert, [false]))
  ).rows[0].id;
  assert.equal(
    (
      await asRole("anon", null, (tx) =>
        tx.query("select id from public.top3d_catalog_products"),
      )
    ).rows.length,
    0,
  );
  assert.equal(
    (
      await asRole("authenticated", viewer, (tx) =>
        tx.query("select id from public.top3d_catalog_products"),
      )
    ).rows.length,
    0,
  );
  assert.equal(
    (
      await asRole("authenticated", admin, (tx) =>
        tx.query("select id from public.top3d_catalog_products"),
      )
    ).rows.length,
    1,
  );
});
test("publicar libera a leitura e usuários comuns continuam sem poder editar ou excluir", async () => {
  await asRole("authenticated", admin, (tx) =>
    tx.query(
      "update public.top3d_catalog_products set published=true where id=$1",
      [productId],
    ),
  );
  assert.equal(
    (
      await asRole("anon", null, (tx) =>
        tx.query("select id from public.top3d_catalog_products"),
      )
    ).rows.length,
    1,
  );
  assert.equal(
    (
      await asRole("authenticated", viewer, (tx) =>
        tx.query(
          "update public.top3d_catalog_products set name=$1 where id=$2 returning id",
          ["Alteração não autorizada", productId],
        ),
      )
    ).rows.length,
    0,
  );
  assert.equal(
    (
      await asRole("authenticated", viewer, (tx) =>
        tx.query(
          "delete from public.top3d_catalog_products where id=$1 returning id",
          [productId],
        ),
      )
    ).rows.length,
    0,
  );
});
test("a lista de administradores não é acessível nem editável pelo cliente", async () => {
  await assert.rejects(
    () =>
      asRole("authenticated", viewer, (tx) =>
        tx.query("select * from top3d_private.catalog_admins"),
      ),
    /permission denied/,
  );
  await assert.rejects(
    () =>
      asRole("authenticated", viewer, (tx) =>
        tx.query(
          "insert into top3d_private.catalog_admins(user_id) values($1)",
          [viewer],
        ),
      ),
    /permission denied/,
  );
});
test("upload e exclusão de imagens exigem administrador e o bucket correto", async () => {
  await assert.rejects(
    () =>
      asRole("authenticated", viewer, (tx) =>
        tx.query("insert into storage.objects values($1,$2)", [
          "top3d-catalog-products",
          `${viewer}/photo.webp`,
        ]),
      ),
    /row-level security/,
  );
  await assert.rejects(
    () =>
      asRole("authenticated", admin, (tx) =>
        tx.query("insert into storage.objects values($1,$2)", [
          "outro-bucket",
          `${admin}/photo.webp`,
        ]),
      ),
    /row-level security/,
  );
  await assert.rejects(
    () =>
      asRole("authenticated", admin, (tx) =>
        tx.query("insert into storage.objects values($1,$2)", [
          "top3d-catalog-products",
          `${viewer}/photo.webp`,
        ]),
      ),
    /row-level security/,
  );
  await asRole("authenticated", admin, (tx) =>
    tx.query("insert into storage.objects values($1,$2)", [
      "top3d-catalog-products",
      `${admin}/photo.webp`,
    ]),
  );
  assert.equal(
    (
      await asRole("authenticated", viewer, (tx) =>
        tx.query("delete from storage.objects returning name"),
      )
    ).rows.length,
    0,
  );
  assert.equal(
    (
      await asRole("authenticated", admin, (tx) =>
        tx.query("delete from storage.objects returning name"),
      )
    ).rows.length,
    1,
  );
});
test("o banco rejeita valores negativos e links de script, mesmo fora do formulário", async () => {
  await assert.rejects(
    () =>
      asRole("authenticated", admin, (tx) =>
        tx.query(
          "update public.top3d_catalog_products set price=-1 where id=$1",
          [productId],
        ),
      ),
    /check constraint/,
  );
  await assert.rejects(
    () =>
      asRole("authenticated", admin, (tx) =>
        tx.query(
          "update public.top3d_catalog_products set product_url='javascript:alert(1)' where id=$1",
          [productId],
        ),
      ),
    /check constraint/,
  );
});
test("migração libera acessórios sem alterar produtos existentes ou aceitar categorias desconhecidas", async () => {
  const before = await db.query("select * from public.top3d_catalog_products where id=$1", [productId]);
  const migration = await readFile(
    new URL("../../back/migrations/003_accessories_category.sql", import.meta.url),
    "utf8",
  );
  await db.exec(migration);
  await db.exec(migration);
  assert.deepEqual(
    (await db.query("select * from public.top3d_catalog_products where id=$1", [productId])).rows,
    before.rows,
  );
  const accessory = await asRole("authenticated", admin, (tx) =>
    tx.query(
      `insert into public.top3d_catalog_products(name,category,brand,description,image_path,published)
       values('Suporte para bobina','Acessórios','ELEGOO','Suporte para organizar bobinas de filamento.',$1,true) returning id`,
      [`${admin}/44444444-4444-4444-8444-444444444444.webp`],
    ),
  );
  const id = accessory.rows[0].id;
  const visible = await asRole("anon", null, (tx) =>
    tx.query("select category, weight, diameter from public.top3d_catalog_products where id=$1", [id]),
  );
  assert.deepEqual(visible.rows, [{ category: "Acessórios", weight: null, diameter: null }]);
  await assert.rejects(
    () => asRole("authenticated", admin, (tx) =>
      tx.query("update public.top3d_catalog_products set category='Categoria inexistente' where id=$1", [id]),
    ),
    /check constraint/,
  );
  await asRole("authenticated", admin, (tx) =>
    tx.query("delete from public.top3d_catalog_products where id=$1", [id]),
  );
});

after(async () => {
  await db.close();
});
