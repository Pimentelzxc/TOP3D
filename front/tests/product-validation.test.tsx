import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyProductForm,
  validateProductForm,
  validateProductImage,
} from "../src/lib/productValidation";
const form = {
  ...emptyProductForm,
  name: "PLA dourado",
  description: "Filamento para projetos decorativos.",
};
test("rascunhos são o padrão; preço e estoque podem ficar sob consulta", () => {
  const values = validateProductForm(form, "photo.webp");
  assert.equal(values.published, false);
  assert.equal(values.price, null);
  assert.equal(values.available, null);
});
test("preço brasileiro e indisponibilidade são preservados", () => {
  const values = validateProductForm(
    { ...form, price: "99,90", availability: "unavailable" },
    "photo.webp",
  );
  assert.equal(values.price, 99.9);
  assert.equal(values.available, false);
});
test("formulário rejeita nomes vazios, marcas desconhecidas, preços negativos e URLs de script", () => {
  assert.throws(() =>
    validateProductForm({ ...form, name: " " }, "photo.webp"),
  );
  assert.throws(() =>
    validateProductForm(
      { ...form, brand: "Marca não cadastrada" },
      "photo.webp",
    ),
  );
  assert.throws(() =>
    validateProductForm({ ...form, price: "-10" }, "photo.webp"),
  );
  assert.throws(() =>
    validateProductForm(
      { ...form, productUrl: "javascript:alert(1)" },
      "photo.webp",
    ),
  );
  assert.throws(() =>
    validateProductForm(
      { ...form, productUrl: "https://user:password@example.com" },
      "photo.webp",
    ),
  );
  assert.throws(() => validateProductForm(form, ""));
});
test("upload valida o conteúdo da imagem e o tamanho, não apenas a extensão", async () => {
  await assert.rejects(
    () =>
      validateProductImage(
        new File(["<script>alert(1)</script>"], "fake.png", {
          type: "image/png",
        }),
      ),
    /foto válida/,
  );
  await assert.rejects(
    () =>
      validateProductImage(
        new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.webp", {
          type: "image/webp",
        }),
      ),
    /5 MB/,
  );
  await validateProductImage(
    new File(
      [new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 0])],
      "photo.jpg",
      { type: "image/jpeg" },
    ),
  );
});
