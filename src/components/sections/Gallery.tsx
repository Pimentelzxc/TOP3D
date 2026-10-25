import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  Instagram,
} from "lucide-react";
import { company } from "../../data/company";
import { Modal } from "../ui/Modal";
import { ExternalLink, Reveal, SectionHeading } from "../ui/Primitives";
const gallery = [
  {
    image: "/images/creative-objects.webp",
    title: "A criatividade ganha forma.",
    subtitle: "Decoração & design",
    className: "gallery-main",
    alt: "Vasos escultóricos e objetos conceituais com textura de impressão 3D",
  },
  {
    image: "/images/hero-spools-gold.webp",
    title: "Tudo começa com um fio.",
    subtitle: "Materiais & possibilidades",
    className: "gallery-spools",
    alt: "Bobinas conceituais de filamento em cores dourado, creme e preto",
  },
  {
    image: "/images/detail-objects.webp",
    title: "Feito de pequenos detalhes.",
    subtitle: "Formas & texturas",
    className: "gallery-detail",
    alt: "Detalhes de objetos decorativos conceituais com linhas de camadas",
  },
];
export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <section id="galeria" className="section container">
      <Reveal>
        <div className="section-row">
          <SectionHeading
            eyebrow="DO IMAGINÁRIO AO TANGÍVEL"
            title={
              <>
                Inspire-se.
                <br />
                <span className="text-muted">
                  Depois, crie o que vem a seguir.
                </span>
              </>
            }
          />
          <ExternalLink className="text-link" href={company.instagram}>
            <Instagram size={18} />
            @top3dd
            <ArrowUpRight size={16} />
          </ExternalLink>
        </div>
        <div className="gallery-grid">
          {gallery.map((g, i) => (
            <button
              className={`gallery-item ${g.className}`}
              key={g.title}
              onClick={() => setIndex(i)}
              aria-label={`Ampliar: ${g.title}`}
            >
              <img
                src={g.image}
                alt={g.alt}
                loading="lazy"
                width="900"
                height="650"
              />
              <span className="gallery-expand">
                <Expand size={18} />
              </span>
              <span className="gallery-caption">
                <small>{g.subtitle}</small>
                <strong>{g.title}</strong>
              </span>
            </button>
          ))}
        </div>
        <div className="gallery-foot">
          <p>
            Imagens conceituais criadas para inspirar. Não representam produtos
            ou projetos reais da TOP3D.
          </p>
          <ExternalLink href={company.instagram} className="text-link">
            Acompanhe a TOP3D no Instagram
            <ArrowUpRight size={16} />
          </ExternalLink>
        </div>
      </Reveal>
      {index !== null && (
        <Modal wide title={gallery[index].title} onClose={() => setIndex(null)}>
          <div
            className="lightbox"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight")
                setIndex((index + 1) % gallery.length);
              if (e.key === "ArrowLeft")
                setIndex((index + gallery.length - 1) % gallery.length);
            }}
          >
            <img src={gallery[index].image} alt={gallery[index].alt} />
            <div className="lightbox-controls">
              <button
                className="icon-button"
                onClick={() =>
                  setIndex((index + gallery.length - 1) % gallery.length)
                }
                aria-label="Imagem anterior"
              >
                <ArrowLeft />
              </button>
              <p>
                {index + 1} / {gallery.length} · Imagem conceitual
              </p>
              <button
                className="icon-button"
                onClick={() => setIndex((index + 1) % gallery.length)}
                aria-label="Próxima imagem"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
