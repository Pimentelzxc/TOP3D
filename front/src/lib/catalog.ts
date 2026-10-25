import type { Product } from "../types";
import { supabase } from "./supabase";
export const CATALOG_BUCKET = "top3d-catalog-products";
export interface CatalogRow {
  id: string;
  name: string;
  category: string;
  brand: string;
  color: string | null;
  weight: string | null;
  diameter: string | null;
  description: string;
  image_path: string;
  price: number | null;
  product_url: string | null;
  available: boolean | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
export type ProductValues = Omit<
  CatalogRow,
  "id" | "created_at" | "updated_at"
>;
export function fromCatalogRow(row: CatalogRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    brand: row.brand,
    color: row.color ?? undefined,
    weight: row.weight ?? undefined,
    diameter: row.diameter ?? undefined,
    description: row.description,
    image:
      supabase?.storage.from(CATALOG_BUCKET).getPublicUrl(row.image_path).data
        .publicUrl ?? "",
    imagePath: row.image_path,
    price: row.price ?? undefined,
    productUrl: row.product_url ?? undefined,
    available: row.available ?? undefined,
    published: row.published,
    verified: true,
    sourceUrl: "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
export async function fetchCatalog(admin = false, signal?: AbortSignal) {
  if (!supabase)
    throw new Error("O serviço do catálogo ainda não foi configurado.");
  let query = supabase
    .from("top3d_catalog_products")
    .select("*")
    .order("created_at", { ascending: false });
  if (!admin) query = query.eq("published", true);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw error;
  return (data as CatalogRow[]).map(fromCatalogRow);
}
export async function saveCatalogProduct(
  id: string | null,
  values: ProductValues,
  expectedUpdatedAt?: string,
) {
  if (!supabase)
    throw new Error("O serviço do catálogo ainda não foi configurado.");
  let query = id
    ? supabase.from("top3d_catalog_products").update(values).eq("id", id)
    : supabase.from("top3d_catalog_products").insert(values);
  if (id && expectedUpdatedAt)
    query = query.eq("updated_at", expectedUpdatedAt);
  const { data, error } = await query.select().maybeSingle();
  if (error) throw error;
  if (!data)
    throw new Error(
      "Este produto foi alterado em outra sessão. Atualize a lista antes de editar novamente.",
    );
  return fromCatalogRow(data as CatalogRow);
}
export async function deleteCatalogProduct(product: Product) {
  if (!supabase)
    throw new Error("O serviço do catálogo ainda não foi configurado.");
  let query = supabase
    .from("top3d_catalog_products")
    .delete()
    .eq("id", product.id);
  if (product.updatedAt) query = query.eq("updated_at", product.updatedAt);
  const { data, error } = await query.select("id");
  if (error) throw error;
  if (!data?.length)
    throw new Error(
      "O produto foi alterado em outra sessão. Atualize a lista antes de excluir.",
    );
}
export async function uploadCatalogImage(file: File, userId: string) {
  if (!supabase)
    throw new Error("O serviço do catálogo ainda não foi configurado.");
  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }[file.type];
  if (!extension) throw new Error("Escolha uma imagem JPG, PNG ou WebP.");
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(CATALOG_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });
  if (error) throw error;
  return path;
}
export async function removeCatalogImage(path: string) {
  if (!supabase || !path) return;
  const { error } = await supabase.storage.from(CATALOG_BUCKET).remove([path]);
  if (error) throw error;
}
