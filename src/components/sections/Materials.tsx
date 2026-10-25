import { ArrowUpRight, Box, Layers3, Palette, ScanLine } from "lucide-react";
import { materials } from "../../data/materials";
import { Reveal, SectionHeading } from "../ui/Primitives";
export default function Materials({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  return (
    <section id="categorias" className="section container">
      <Reveal>
        <div className="section-row">
          <SectionHeading
            eyebrow="UM UNIVERSO DE POSSIBILIDADES"
            title={
              <>
                Qual é a sua próxima
                <br />
                <span className="text-muted">grande ideia?</span>
              </>
            }
            description="Conheça os materiais que dão forma à criatividade. Cada um tem suas características. Cada projeto, seu caminho."
          />
          <a className="text-link" href="#guia">
            Compare os materiais
            <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="material-grid">
          {materials.map((m, i) => (
            <button
              key={m.id}
              className={`material-card material-${m.id}`}
              onClick={() => {
                onSelect(m.id);
                document
                  .getElementById("guia")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ "--material-color": m.color } as React.CSSProperties}
            >
              <span className="material-number">0{i + 1} / MATERIAL</span>
              <span className="material-photo">
                <img
                  src={m.image}
                  alt={m.imageAlt}
                  width="640"
                  height="480"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="material-card-bottom">
                <span>
                  <strong>{m.name}</strong>
                  <small>{m.imageSubject}</small>
                </span>
                <span className="round-arrow">
                  <ArrowUpRight size={18} />
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className="section-note">
          Fotos de aplicações reais por Prusa Research. Exemplos educativos de
          terceiros; consulte a TOP3D para confirmar o catálogo disponível.
        </p>
        <div
          className="material-photo-credits"
          aria-label="Fontes das fotografias dos materiais"
        >
          <span>Fontes das fotos:</span>
          {materials.map((m) => (
            <a
              key={m.id}
              href={m.imageSource}
              target="_blank"
              rel="noopener noreferrer"
            >
              {m.name}
              <ArrowUpRight size={11} />
            </a>
          ))}
        </div>
      </Reveal>
      <div className="benefit-grid">
        {[
          {
            icon: Layers3,
            title: "O material faz a diferença",
            copy: "Entenda as propriedades antes de escolher o seu próximo filamento.",
          },
          {
            icon: Palette,
            title: "Crie do seu jeito",
            copy: "Explore como cores, texturas e geometrias mudam uma ideia.",
          },
          {
            icon: ScanLine,
            title: "Cada detalhe importa",
            copy: "Combine aplicação, material e parâmetros para evoluir a cada impressão.",
          },
          {
            icon: Box,
            title: "Da tela para o mundo",
            copy: "Transforme modelos digitais em objetos que você pode tocar.",
          },
        ].map(({ icon: Icon, title, copy }) => (
          <Reveal key={title} className="benefit">
            <Icon size={22} />
            <h3>{title}</h3>
            <p>{copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
