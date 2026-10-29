import { useEffect, useState, type FormEvent } from "react";
import { Check, ImagePlus, LoaderCircle, Save } from "lucide-react";
import type { Product } from "../../types";
import { brandNames, materialOptions } from "../../data/brands";
import { Modal } from "../ui/Modal";
import {
  emptyProductForm,
  validateProductForm,
  validateProductImage,
  type ProductForm,
} from "../../lib/productValidation";
import {
  saveCatalogProduct,
  uploadCatalogImage,
  removeCatalogImage,
} from "../../lib/catalog";
export default function ProductEditor({
  product,
  userId,
  onClose,
  onSaved,
}: {
  product: Product | null;
  userId: string;
  onClose: () => void;
  onSaved: (product: Product, notice: string) => void;
}) {
  const [form, setForm] = useState<ProductForm>(() =>
    product
      ? {
          name: product.name,
          category: product.category,
          brand: product.brand || brandNames[0],
          color: product.color || "",
          weight: product.weight || "",
          diameter: product.diameter || "",
          description: product.description,
          price:
            product.price === undefined
              ? ""
              : String(product.price).replace(".", ","),
          productUrl: product.productUrl || "",
          availability:
            product.available === undefined
              ? "unknown"
              : product.available
                ? "available"
                : "unavailable",
          published: product.published ?? false,
        }
      : { ...emptyProductForm },
  );
  const [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState(product?.image || ""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(
    () => () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  function update<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }
  async function selectPhoto(selected?: File) {
    if (!selected) return;
    try {
      await validateProductImage(selected);
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError("");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível ler a foto.",
      );
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const values = validateProductForm(
        form,
        product?.imagePath || (file ? "pending" : ""),
      );
      setBusy(true);
      if (file) {
        await validateProductImage(file);
        values.image_path = await uploadCatalogImage(file, userId);
      }
      const saved = await saveCatalogProduct(
        product?.id || null,
        values,
        product?.updatedAt,
      );
      let notice = form.published
        ? "Produto publicado no catálogo."
        : "Rascunho salvo. Ele ainda não aparece no catálogo.";
      if (file && product?.imagePath) {
        try {
          await removeCatalogImage(product.imagePath);
        } catch {
          notice += " A foto anterior foi mantida no armazenamento.";
        }
      }
      onSaved(saved, notice);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível salvar. Confira sua conexão e seu acesso de administradora.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={product ? "Editar produto" : "Adicionar ao catálogo"}
      wide
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form className="product-editor" onSubmit={submit}>
        <fieldset disabled={busy}>
          <div className="editor-grid">
            <div className="editor-photo-column">
              <div className="editor-preview">
                {preview ? (
                  <img src={preview} alt="Prévia da foto do produto" />
                ) : (
                  <div>
                    <ImagePlus size={38} />
                    <strong>A primeira impressão conta.</strong>
                    <span>Adicione uma boa foto do produto.</span>
                  </div>
                )}
              </div>
              <label className="button button-outline upload-button">
                <ImagePlus size={17} />
                {preview ? "Trocar fotografia" : "Escolher fotografia"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-label="Fotografia do produto"
                  onChange={(event) =>
                    void selectPhoto(event.target.files?.[0])
                  }
                />
              </label>
              <p className="admin-helper">
                JPG, PNG ou WebP · até 5 MB.
                <br />
                As fotos dos produtos ficam públicas. Use imagens que você tem
                autorização para publicar.
              </p>
              <div className="editor-preview-caption">
                <span>PRÉVIA DO CATÁLOGO</span>
                <h3>{form.name || "Nome do produto"}</h3>
                <p>
                  {form.brand} · {form.category}
                  {form.color && ` · ${form.color}`}
                </p>
              </div>
            </div>
            <div className="editor-fields">
              <label>
                Nome do produto *
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ex.: Filamento PLA Silk Dourado"
                />
              </label>
              <div className="form-row">
                <label>
                  Marca *
                  <select
                    value={form.brand}
                    onChange={(e) => update("brand", e.target.value)}
                  >
                    {brandNames.map((brand) => (
                      <option key={brand}>{brand}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Material / categoria *
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    {materialOptions.map((material) => (
                      <option key={material}>{material}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Cor
                  <input
                    maxLength={60}
                    value={form.color}
                    onChange={(e) => update("color", e.target.value)}
                    placeholder="Dourado"
                  />
                </label>
                <label>
                  Preço (R$)
                  <input
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="Em branco: sob consulta"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Peso
                  <input
                    maxLength={40}
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                    placeholder="Ex.: 1 kg"
                  />
                </label>
                <label>
                  Diâmetro
                  <input
                    maxLength={40}
                    value={form.diameter}
                    onChange={(e) => update("diameter", e.target.value)}
                    placeholder="Ex.: 1,75 mm"
                  />
                </label>
              </div>
              <label>
                Descrição *
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Conte sobre as características e aplicações deste produto."
                />
                <span className="field-counter">
                  {form.description.length}/2000
                </span>
              </label>
              <label>
                Disponibilidade
                <select
                  value={form.availability}
                  onChange={(e) => update("availability", e.target.value)}
                >
                  <option value="unknown">Confirmar pelo WhatsApp</option>
                  <option value="available">Disponível</option>
                  <option value="unavailable">Indisponível</option>
                </select>
              </label>
              <label>
                Link de compra (opcional)
                <input
                  type="url"
                  maxLength={2048}
                  value={form.productUrl}
                  onChange={(e) => update("productUrl", e.target.value)}
                  placeholder="https://"
                />
                <span className="admin-helper">
                  Sem link, o cliente consulta este produto pelo WhatsApp da
                  TOP3D.
                </span>
              </label>
              <label className="publish-option">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => update("published", e.target.checked)}
                />
                <span>
                  <strong>Publicar no catálogo</strong>
                  <small>
                    {form.published
                      ? "O produto ficará visível para os visitantes."
                      : "Salvar como rascunho, visível apenas no painel."}
                  </small>
                </span>
                <Check size={18} />
              </label>
            </div>
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
        <div className="editor-footer">
          <p>Os campos com * são obrigatórios.</p>
          <button
            className="button button-outline"
            type="button"
            disabled={busy}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="button button-primary"
            disabled={busy}
          >
            {busy ? (
              <LoaderCircle size={17} className="spin" />
            ) : (
              <Save size={17} />
            )}{" "}
            {busy
              ? "Salvando…"
              : form.published
                ? "Salvar e publicar"
                : "Salvar rascunho"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
