import { brandNames, materialOptions } from "../data/brands";
import type { ProductValues } from "./catalog";
export interface ProductForm {
  name: string;
  category: string;
  brand: string;
  color: string;
  weight: string;
  diameter: string;
  description: string;
  price: string;
  productUrl: string;
  availability: string;
  published: boolean;
}
export const emptyProductForm: ProductForm = {
  name: "",
  category: "PLA",
  brand: "Multfila",
  color: "",
  weight: "",
  diameter: "",
  description: "",
  price: "",
  productUrl: "",
  availability: "unknown",
  published: false,
};
export function validateProductForm(
  form: ProductForm,
  imagePath: string,
): ProductValues {
  const name = form.name.trim(),
    description = form.description.trim();
  if (name.length < 2 || name.length > 120)
    throw new Error("O nome deve ter entre 2 e 120 caracteres.");
  if (description.length < 10 || description.length > 2000)
    throw new Error("A descrição deve ter entre 10 e 2.000 caracteres.");
  if (!brandNames.includes(form.brand))
    throw new Error("Escolha uma das marcas cadastradas.");
  if (!materialOptions.includes(form.category))
    throw new Error("Escolha um material válido.");
  if (!imagePath) throw new Error("Adicione uma foto do produto.");
  const price =
    form.price.trim() === "" ? null : Number(form.price.replace(",", "."));
  if (
    price !== null &&
    (!Number.isFinite(price) || price < 0 || price > 1000000)
  )
    throw new Error("Informe um preço válido ou deixe o campo em branco.");
  const productUrl = form.productUrl.trim();
  if (productUrl) {
    try {
      const url = new URL(productUrl);
      if (url.protocol !== "https:" || url.username || url.password)
        throw new Error();
    } catch {
      throw new Error(
        "O link de compra deve começar com https:// e não pode conter credenciais.",
      );
    }
  }
  if (
    form.color.trim().length > 60 ||
    form.weight.trim().length > 40 ||
    form.diameter.trim().length > 40
  )
    throw new Error("Revise o tamanho dos campos de cor, peso e diâmetro.");
  if (!["unknown", "available", "unavailable"].includes(form.availability))
    throw new Error("Escolha uma disponibilidade válida.");
  return {
    name,
    description,
    category: form.category,
    brand: form.brand,
    color: form.color.trim() || null,
    weight: form.weight.trim() || null,
    diameter: form.diameter.trim() || null,
    image_path: imagePath,
    price,
    product_url: productUrl || null,
    available:
      form.availability === "unknown"
        ? null
        : form.availability === "available",
    published: form.published,
  };
}
export async function validateProductImage(file: File) {
  if (file.size > 5 * 1024 * 1024)
    throw new Error("A foto deve ter no máximo 5 MB.");
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
    (byte, index) => bytes[index] === byte,
  );
  const webp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (
    !(
      (file.type === "image/jpeg" && jpeg) ||
      (file.type === "image/png" && png) ||
      (file.type === "image/webp" && webp)
    )
  )
    throw new Error("Use uma foto válida em JPG, PNG ou WebP.");
}
