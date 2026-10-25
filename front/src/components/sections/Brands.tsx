import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUpRight, Layers3 } from "lucide-react";
import { brands } from "../../data/brands";
import {
  ContactButton,
  ExternalLink,
  Reveal,
  SectionHeading,
} from "../ui/Primitives";
export default function Brands({
  onCatalogBrand,
}: {
  onCatalogBrand: (brand: string) => void;
}) {
  const [active, setActive] = useState(0);
  const brand = brands[active];
  return (
    <section id="marcas" className="section brands-section">
      <div className="container">
        <Reveal>
          <div className="section-row">
            <SectionHeading
              eyebrow="MARCAS QUE FAZEM PARTE DA TOP3D"
              title={
                <>
                  Boas ideias merecem
                  <br />
                  <span className="text-muted">bons materiais.</span>
                </>
              }
              description="Uma seleção de marcas para acompanhar a sua criatividade. Conheça as possibilidades de cada uma e encontre o seu próximo filamento."
            />
            <span className="brands-signature">
              <Layers3 size={22} />
              SELEÇÃO TOP3D
              <br />
              FEITA PARA QUEM CRIA
            </span>
          </div>
          <div
            className="brand-tabs"
            role="tablist"
            aria-label="Marcas com que trabalhamos"
          >
            {brands.map((b, index) => (
              <button
                id={`brand-tab-${b.id}`}
                key={b.id}
                type="button"
                role="tab"
                tabIndex={active === index ? 0 : -1}
                aria-selected={active === index}
                aria-controls="brand-panel"
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? brands.length - 1
                          : (index +
                              (event.key === "ArrowRight"
                                ? 1
                                : brands.length - 1)) %
                            brands.length;
                    setActive(next);
                    document
                      .getElementById(`brand-tab-${brands[next].id}`)
                      ?.focus();
                  }
                }}
              >
                <span className={`brand-logo-wrap brand-logo-${b.id}`}>
                  <img
                    src={b.logo}
                    alt={b.name}
                    width="200"
                    height="70"
                    loading="lazy"
                  />
                </span>
                <span className="brand-tab-number">
                  0{index + 1}
                  <ArrowUpRight size={14} />
                </span>
              </button>
            ))}
          </div>
          <div
            id="brand-panel"
            role="tabpanel"
            aria-labelledby={`brand-tab-${brand.id}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={brand.id}
                className="brand-feature"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <div className="brand-photo">
                  <img
                    src={brand.image}
                    alt={brand.imageAlt}
                    width="800"
                    height="800"
                    loading="lazy"
                  />
                  <span>UNIVERSO {brand.name.toUpperCase()}</span>
                </div>
                <div className="brand-story">
                  <span className="eyebrow">{brand.origin}</span>
                  <h3>{brand.heading}</h3>
                  <p>{brand.description}</p>
                  <div className="brand-materials">
                    {brand.materials.map((material) => (
                      <span key={material}>{material}</span>
                    ))}
                  </div>
                  <div className="brand-actions">
                    <ContactButton
                      className="button-primary"
                      intent="brand"
                      brand={brand.name}
                    >
                      Consultar {brand.name}
                    </ContactButton>
                    <button
                      className="text-link"
                      onClick={() => {
                        onCatalogBrand(brand.name);
                        document
                          .getElementById("catalogo")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Ver no catálogo
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="brand-sources">
                    <ExternalLink href={brand.website}>
                      Conheça a marca
                      <ArrowUpRight size={12} />
                    </ExternalLink>
                    <ExternalLink href={brand.photoSource}>
                      Fonte da fotografia
                      <ArrowUpRight size={12} />
                    </ExternalLink>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="section-note">
            As imagens apresentam referências das marcas. Consulte no catálogo
            os produtos publicados pela TOP3D e confirme a disponibilidade pelo
            WhatsApp.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
