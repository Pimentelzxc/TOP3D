import { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Eye,
  FilePenLine,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  PackageOpen,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAdminSession } from "../hooks/useAdminSession";
import {
  deleteCatalogProduct,
  fetchCatalog,
  removeCatalogImage,
} from "../lib/catalog";
import { Modal } from "../components/ui/Modal";
import AdminLogin from "../components/admin/AdminLogin";
import type { Product } from "../types";
const ProductEditor = lazy(() => import("../components/admin/ProductEditor"));
export default function AdminPage() {
  const access = useAdminSession();
  const location = useLocation();
  useEffect(() => {
    const oldTitle = document.title;
    document.title = "Administração do catálogo | TOP3D";
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const original = robots?.content;
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    robots.content = "noindex, nofollow";
    return () => {
      document.title = oldTitle;
      if (created) robots.remove();
      else robots.content = original || "";
    };
  }, []);
  if (location.pathname.replace(/\/$/, "") === "/admin/recuperar")
    return <AdminLogin recovery />;
  if (!supabase || access.status === "anonymous") return <AdminLogin />;
  if (access.status === "loading")
    return (
      <div className="admin-loading">
        <LoaderCircle size={30} className="spin" />
        <p>Preparando seu espaço…</p>
      </div>
    );
  if (access.status !== "admin")
    return (
      <div className="admin-access-message">
        <ShieldCheck size={38} />
        <h1>
          {access.status === "denied"
            ? "Este acesso ainda não foi autorizado."
            : "Não foi possível verificar seu acesso."}
        </h1>
        <p>
          {access.status === "denied"
            ? "A conta precisa ser habilitada para administrar o catálogo da TOP3D."
            : "Verifique a conexão e a configuração do serviço. Tente novamente."}
        </p>
        <button
          className="button button-primary"
          onClick={() => void supabase!.auth.signOut()}
        >
          Voltar ao login
        </button>
        <Link to="/" className="text-link">
          Ir para o site
          <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  return (
    <Dashboard
      userId={access.session!.user.id}
      email={access.session!.user.email || "Administradora"}
    />
  );
}
function Dashboard({ userId, email }: { userId: string; email: string }) {
  const [items, setItems] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [editor, setEditor] = useState<Product | null | undefined>(undefined),
    [deleting, setDeleting] = useState<Product | null>(null),
    [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const load = useCallback(() => {
    setLoading(true);
    setError("");
    setRevision((value) => value + 1);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetchCatalog(true, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setItems(data);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError(
            "Não foi possível carregar seus produtos. Verifique a conexão e tente novamente.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);
  const filtered = items.filter(
    (item) =>
      `${item.name} ${item.brand} ${item.category} ${item.color || ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")) &&
      (filter === "all" ||
        (filter === "published" ? item.published : !item.published)),
  );
  const published = items.filter((item) => item.published).length;
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      await deleteCatalogProduct(deleting);
      let message = "Produto excluído do catálogo.";
      if (deleting.imagePath) {
        try {
          await removeCatalogImage(deleting.imagePath);
        } catch {
          message += " A fotografia foi mantida no armazenamento.";
        }
      }
      setItems((previous) =>
        previous.filter((item) => item.id !== deleting.id),
      );
      setDeleting(null);
      setNotice(message);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível excluir o produto.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    const { error } = await supabase!.auth.signOut();
    if (error)
      setError(
        "Não foi possível sair. Verifique sua conexão e tente novamente.",
      );
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-sidebar-logo" to="/">
          <img
            src="/images/top3d-logo.webp"
            alt="TOP3D"
            width="100"
            height="100"
          />
          <span>
            TOP3D<small>ESTÚDIO DA LOJA</small>
          </span>
        </Link>
        <span className="admin-nav-label">SEU ESPAÇO</span>
        <a href="/admin" className="admin-nav-active">
          <LayoutGrid size={18} />
          Catálogo<span>{items.length}</span>
        </a>
        <Link to="/#marcas">
          <PackageOpen size={18} />
          Nossas marcas
          <ArrowUpRight size={14} />
        </Link>
        <Link to="/" target="_blank" rel="noopener noreferrer">
          <Eye size={18} />
          Ver site
          <ArrowUpRight size={14} />
        </Link>
        <div className="admin-sidebar-bottom">
          <ShieldCheck size={19} />
          <span>
            Acesso de administradora
            <small>Seu catálogo, sob seu cuidado.</small>
          </span>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <span>
            <span className="status-dot" />
            PAINEL DE ADMINISTRAÇÃO
          </span>
          <div>
            <span className="admin-user-email">{email}</span>
            <button
              type="button"
              className="button button-outline"
              onClick={() => void logout()}
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </header>
        <main className="admin-main">
          <div className="admin-page-heading">
            <div>
              <div className="eyebrow">CURADORIA QUE DÁ VIDA ÀS IDEIAS</div>
              <h1>
                Seu catálogo, em boas mãos<span>.</span>
              </h1>
              <p>
                Adicione materiais, cuide dos detalhes e publique novas
                possibilidades.
              </p>
            </div>
            <button
              className="button button-primary"
              onClick={() => {
                setEditor(null);
                setNotice("");
              }}
            >
              <Plus size={18} />
              Adicionar produto
            </button>
          </div>
          <div className="admin-stats">
            {[
              {
                label: "No seu catálogo",
                value: items.length,
                icon: PackageOpen,
                note: "produtos cadastrados",
              },
              {
                label: "Na vitrine",
                value: published,
                icon: Eye,
                note: "visíveis para os clientes",
              },
              {
                label: "Em preparação",
                value: items.length - published,
                icon: FilePenLine,
                note: "rascunhos para revisar",
              },
            ].map(({ label, value, icon: Icon, note }) => (
              <div key={label}>
                <span>
                  {label}
                  <Icon size={19} />
                </span>
                <strong>
                  {loading ? "—" : value.toString().padStart(2, "0")}
                </strong>
                <small>{note}</small>
              </div>
            ))}
          </div>
          {notice && (
            <div className="admin-success admin-notice" role="status">
              <Check size={17} />
              {notice}
              <button
                aria-label="Dispensar mensagem"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {error && (
            <div className="admin-error" role="alert">
              {error}
              <button className="text-link" onClick={() => void load()}>
                Tentar novamente
                <RefreshCw size={14} />
              </button>
            </div>
          )}
          <section
            className="admin-catalog-panel"
            aria-label="Gerenciar produtos"
          >
            <div className="admin-table-toolbar">
              <div className="admin-filter-tabs">
                {[
                  ["all", "Todos"],
                  ["published", "Publicados"],
                  ["draft", "Rascunhos"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={filter === value ? "selected" : ""}
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="search-field">
                <Search size={16} />
                <input
                  aria-label="Buscar produto no painel"
                  placeholder="Busque por nome, marca ou material"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <button
                className="icon-button"
                disabled={loading}
                onClick={() => void load()}
                aria-label="Atualizar produtos"
              >
                <RefreshCw size={17} className={loading ? "spin" : ""} />
              </button>
            </div>
            {loading ? (
              <div className="admin-table-loading">
                <LoaderCircle className="spin" size={27} />
                <p>Buscando seus produtos…</p>
              </div>
            ) : filtered.length ? (
              <div className="admin-product-list">
                <div className="admin-list-header">
                  <span>PRODUTO</span>
                  <span>VALOR</span>
                  <span>PUBLICAÇÃO</span>
                  <span>AÇÕES</span>
                </div>
                {filtered.map((product) => (
                  <article className="admin-product-row" key={product.id}>
                    <div className="admin-product-name">
                      <img
                        src={product.image}
                        alt={product.name}
                        width="64"
                        height="64"
                        loading="lazy"
                      />
                      <div>
                        <h2>{product.name}</h2>
                        <p>
                          {product.brand} · {product.category}
                          {product.color && ` · ${product.color}`}
                        </p>
                      </div>
                    </div>
                    <span className="admin-price">
                      {product.price === undefined
                        ? "Sob consulta"
                        : product.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                    </span>
                    <span
                      className={`publication-badge ${product.published ? "is-published" : ""}`}
                    >
                      <span />
                      {product.published ? "Publicado" : "Rascunho"}
                    </span>
                    <div className="admin-row-actions">
                      <button
                        className="icon-button"
                        aria-label={`Editar ${product.name}`}
                        onClick={() => setEditor(product)}
                      >
                        <FilePenLine size={17} />
                      </button>
                      <button
                        className="icon-button delete-button"
                        aria-label={`Excluir ${product.name}`}
                        onClick={() => setDeleting(product)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : error ? null : (
              <div className="admin-empty">
                <span>
                  <PackageOpen size={40} strokeWidth={1.2} />
                </span>
                <h2>
                  {items.length
                    ? "Nenhum produto por aqui."
                    : "Vamos montar sua primeira seleção?"}
                </h2>
                <p>
                  {items.length
                    ? "Altere a busca ou o filtro para encontrar seus produtos."
                    : "Adicione o primeiro filamento. Você pode preparar um rascunho e publicar quando estiver tudo pronto."}
                </p>
                <button
                  className="button button-primary"
                  onClick={() => setEditor(null)}
                >
                  <Plus size={17} />
                  Adicionar produto
                </button>
              </div>
            )}
          </section>
          <p className="admin-bottom-note">
            Somente produtos publicados aparecem no site. Fotos e dados são
            salvos online.
          </p>
        </main>
      </div>
      {editor !== undefined && (
        <Suspense
          fallback={
            <div className="admin-overlay-loading">
              <LoaderCircle className="spin" />
            </div>
          }
        >
          <ProductEditor
            product={editor}
            userId={userId}
            onClose={() => setEditor(undefined)}
            onSaved={(product, message) => {
              setItems((previous) => [
                product,
                ...previous.filter((item) => item.id !== product.id),
              ]);
              setEditor(undefined);
              setNotice(message);
            }}
          />
        </Suspense>
      )}
      {deleting && (
        <Modal
          title="Excluir este produto?"
          onClose={() => {
            if (!busy) setDeleting(null);
          }}
        >
          <p>
            O produto <strong>{deleting.name}</strong> será removido do catálogo
            e do painel. Para apenas escondê-lo do site, edite e salve como
            rascunho.
          </p>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button
              className="button button-outline"
              disabled={busy}
              onClick={() => setDeleting(null)}
            >
              Cancelar
            </button>
            <button
              className="button admin-danger-button"
              disabled={busy}
              onClick={() => void remove()}
            >
              {busy ? (
                <LoaderCircle size={17} className="spin" />
              ) : (
                <Trash2 size={17} />
              )}
              Excluir produto
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
