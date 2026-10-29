import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  PackageSearch,
  Search,
  Share2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Product } from "../../types";
import { useCatalog } from "../../hooks/useCatalog";
import { brandNames } from "../../data/brands";
import { ContactButton, SectionHeading, Reveal } from "../ui/Primitives";
import { Modal } from "../ui/Modal";
export default function Catalog({
  brandFilter,
  onBrandFilterChange,
}: {
  brandFilter?: string;
  onBrandFilterChange?: (brand: string) => void;
} = {}) {
  const { products, loading, error, refresh } = useCatalog();
  const [localBrand, setLocalBrand] = useState("Todas");
  const brand = brandFilter ?? localBrand;
  const setBrand = onBrandFilterChange ?? setLocalBrand;
  const [query, setQuery] = useState(""),
    [material, setMaterial] = useState("Todos"),
    [color, setColor] = useState("Todas"),
    [sort, setSort] = useState("default"),
    [filters, setFilters] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null),
    [shareStatus, setShareStatus] = useState("");
  const track = useRef<HTMLDivElement>(null);
  const confirmed = useMemo(
    () => products.filter((p) => p.verified && p.published !== false),
    [products],
  );
  const categories = ["Todos", ...new Set(confirmed.map((p) => p.category))];
  const result = useMemo(() => {
    const items = confirmed.filter(
      (p) =>
        `${p.name} ${p.brand || ""} ${p.color || ""} ${p.category}`
          .toLocaleLowerCase("pt-BR")
          .includes(query.toLocaleLowerCase("pt-BR")) &&
        (material === "Todos" || p.category === material) &&
        (brand === "Todas" || p.brand === brand) &&
        (color === "Todas" || p.color === color),
    );
    if (sort === "name")
      items.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (sort === "price")
      items.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    return items;
  }, [query, material, brand, color, sort, confirmed]);
  async function share(p: Product) {
    const url = p.productUrl || `${location.origin}/#catalogo`;
    try {
      if (navigator.share) {
        await navigator.share({ title: p.name, text: p.description, url });
        setShareStatus("Produto compartilhado.");
      } else {
        await navigator.clipboard.writeText(`${p.name} — ${url}`);
        setShareStatus("Link copiado.");
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError"))
        setShareStatus(
          "Não foi possível compartilhar. Copie o endereço da página.",
        );
    }
  }
  return (
    <section id="catalogo" className="catalog-section section">
      <div className="container">
        <Reveal>
          <div className="section-row">
            <SectionHeading
              eyebrow="CATÁLOGO TOP3D · SUA PRÓXIMA CRIAÇÃO"
              title={
                <>
                  O filamento certo.
                  <br />
                  <span className="text-muted">Para a sua melhor criação.</span>
                </>
              }
              description="Explore materiais, cores e acabamentos. Confirme as opções disponíveis diretamente com a TOP3D."
            />
            <ContactButton className="button-outline" intent="catalog">
              Consultar catálogo
            </ContactButton>
          </div>
          <div className="catalog-toolbar">
            <div className="filter-tabs" aria-label="Filtrar por material">
              {categories.map((c) => (
                <button
                  className={material === c ? "selected" : ""}
                  key={c}
                  aria-pressed={material === c}
                  onClick={() => setMaterial(c)}
                >
                  {c === "Todos" ? "Todos os filamentos" : c}
                </button>
              ))}
            </div>
            <div className="catalog-tools">
              <label className="search-field">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busque sua próxima ideia"
                  aria-label="Pesquisar filamentos"
                />
                {query && (
                  <button
                    aria-label="Limpar pesquisa"
                    onClick={() => setQuery("")}
                  >
                    <X size={15} />
                  </button>
                )}
              </label>
              <button
                className={`icon-button ${filters ? "selected" : ""}`}
                aria-label="Filtros e ordenação"
                aria-expanded={filters}
                aria-controls="catalog-filters"
                onClick={() => setFilters(!filters)}
              >
                <SlidersHorizontal size={19} />
              </button>
            </div>
          </div>
          {filters && (
            <div id="catalog-filters" className="advanced-filters">
              <label>
                Marca
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option>Todas</option>
                  {[
                    ...new Set([
                      ...brandNames,
                      ...confirmed.map((p) => p.brand).filter(Boolean),
                    ]),
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Cor
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option>Todas</option>
                  {[
                    ...new Set(confirmed.map((p) => p.color).filter(Boolean)),
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Ordenar
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="default">Destaques</option>
                  <option value="name">Nome A–Z</option>
                  <option value="price">Menor preço confirmado</option>
                </select>
              </label>
              <button
                className="text-link"
                onClick={() => {
                  setQuery("");
                  setMaterial("Todos");
                  setBrand("Todas");
                  setColor("Todas");
                  setSort("default");
                }}
              >
                Limpar filtros
                <X size={15} />
              </button>
            </div>
          )}
          {brand !== "Todas" && (
            <div className="catalog-brand-filter">
              <span>
                Marca selecionada: <strong>{brand}</strong>
              </span>
              <button className="text-link" onClick={() => setBrand("Todas")}>
                Ver todas as marcas
                <X size={14} />
              </button>
            </div>
          )}
          {loading && (
            <div
              className="catalog-skeletons"
              aria-label="Carregando catálogo"
              role="status"
            >
              {[1, 2, 3, 4].map((value) => (
                <div key={value} />
              ))}
            </div>
          )}
          {error && (
            <div className="catalog-error" role="alert">
              <p>{error}</p>
              <button className="button button-outline" onClick={refresh}>
                Tentar novamente
              </button>
            </div>
          )}
          <div className="product-track" ref={track}>
            {result.map((p) => (
              <article className="product-card" key={p.id}>
                <button
                  className="product-image"
                  onClick={() => setSelected(p)}
                  aria-label={`Ver detalhes de ${p.name}`}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width="420"
                    height="420"
                  />
                </button>
                <span className="eyebrow">
                  {p.category}
                  {p.brand && ` / ${p.brand}`}
                </span>
                <h3>{p.name}</h3>
                <p>
                  {[p.color, p.weight, p.diameter].filter(Boolean).join(" · ")}
                </p>
                {p.price !== undefined && (
                  <strong>
                    {p.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                )}
                {p.available !== undefined && (
                  <small>
                    {p.available
                      ? "Disponibilidade confirmada"
                      : "Indisponível no momento"}
                  </small>
                )}
                <button className="text-link" onClick={() => setSelected(p)}>
                  Ver detalhes
                  <ArrowUpRight size={17} />
                </button>
              </article>
            ))}
          </div>
          {!loading && !error && result.length === 0 && (
            <div className="catalog-empty" role="status">
              <div className="empty-symbol">
                <PackageSearch size={35} strokeWidth={1.3} />
              </div>
              <div>
                <span className="eyebrow">VAMOS ENCONTRAR O SEU MATERIAL</span>
                <h3>
                  {confirmed.length
                    ? "Nenhum filamento com esses filtros."
                    : "Seu próximo filamento está a uma conversa."}
                </h3>
                <p>
                  {confirmed.length
                    ? "Tente outra busca ou limpe os filtros."
                    : "Fale com a TOP3D para conhecer os materiais, as cores e a disponibilidade para o seu próximo projeto."}
                </p>
              </div>
              <ContactButton className="button-primary" intent="options">
                Consultar opções
              </ContactButton>
            </div>
          )}
          {result.length > 0 && (
            <div className="carousel-controls">
              <span aria-live="polite">{result.length} produtos</span>
              <button
                className="icon-button"
                onClick={() =>
                  track.current?.scrollBy({ left: -340, behavior: "smooth" })
                }
                aria-label="Produtos anteriores"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                className="icon-button"
                onClick={() =>
                  track.current?.scrollBy({ left: 340, behavior: "smooth" })
                }
                aria-label="Próximos produtos"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </Reveal>
      </div>
      {selected && (
        <Modal
          title={selected.name}
          onClose={() => {
            setSelected(null);
            setShareStatus("");
          }}
        >
          <img
            className="detail-image"
            src={selected.image}
            alt={selected.name}
          />
          <p>{selected.description}</p>
          <dl className="product-specs">
            {Object.entries({
              [selected.category === "Acessórios" ? "Categoria" : "Material"]:
                selected.category,
              Marca: selected.brand,
              Cor: selected.color,
              Peso: selected.weight,
              Diâmetro: selected.diameter,
            })
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
          <div className="modal-actions">
            {selected.productUrl ? (
              <a
                className="button button-primary"
                href={selected.productUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver na loja oficial
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <ContactButton className="button-primary" product={selected.name}>
                Consultar disponibilidade
              </ContactButton>
            )}
            <button
              className="icon-button"
              onClick={() => share(selected)}
              aria-label="Compartilhar produto"
            >
              {shareStatus ? <Check size={20} /> : <Share2 size={20} />}
            </button>
          </div>
          <p role="status">{shareStatus}</p>
        </Modal>
      )}
    </section>
  );
}
