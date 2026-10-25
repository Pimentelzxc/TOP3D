import {
  ArrowUpRight,
  Box,
  Boxes,
  GraduationCap,
  Lightbulb,
  Shapes,
  Wrench,
} from "lucide-react";
import { company } from "../../data/company";
import { ExternalLink, Reveal, SectionHeading } from "../ui/Primitives";
export default function About() {
  return (
    <>
      <section id="sobre" className="section about-section">
        <div className="container about-grid">
          <Reveal className="about-art">
            <div className="layer-art" aria-hidden="true">
              {Array.from({ length: 20 }, (_, i) => (
                <i key={i} style={{ "--i": i } as React.CSSProperties} />
              ))}
            </div>
            <span className="eyebrow">UMA IDEIA. INFINITAS CAMADAS.</span>
            <span className="about-art-word">
              MAKE
              <br />
              IT <span>REAL.</span>
            </span>
            <span className="about-art-bottom">
              <Box size={18} />O FUTURO TEM A FORMA QUE VOCÊ CRIA.
            </span>
          </Reveal>
          <Reveal className="about-copy">
            <SectionHeading
              eyebrow="MUITO PRAZER, SOMOS A TOP3D"
              title={
                <>
                  Tecnologia para
                  <br />
                  transformar ideias
                  <br />
                  <span className="text-accent">em realidade.</span>
                </>
              }
            />
            <p>
              Entre o que você imagina e o que você pode criar, existe um
              universo de possibilidades. É nesse encontro entre tecnologia e
              criatividade que a TOP3D se apresenta.
            </p>
            <p>
              Explore o universo dos filamentos, conheça as características de
              cada material e encontre inspiração para o próximo projeto. Para
              conhecer a empresa e as opções disponíveis, acompanhe nosso
              perfil.
            </p>
            <ExternalLink
              href={company.instagram}
              className="button button-outline"
            >
              Conheça a TOP3D no Instagram
              <ArrowUpRight size={17} />
            </ExternalLink>
          </Reveal>
        </div>
      </section>
      <section className="section container applications">
        <Reveal>
          <SectionHeading
            eyebrow="O QUE VOCÊ PODE CRIAR?"
            title={<>Muito além de uma impressão.</>}
          />
          <div className="application-grid">
            {[
              {
                icon: Boxes,
                title: "Prototipagem",
                copy: "Teste ideias no mundo real.",
              },
              {
                icon: Shapes,
                title: "Decoração",
                copy: "Objetos com a sua personalidade.",
              },
              {
                icon: Wrench,
                title: "Peças funcionais",
                copy: "Soluções para o dia a dia.",
              },
              {
                icon: GraduationCap,
                title: "Educação",
                copy: "Conhecimento que ganha forma.",
              },
              {
                icon: Box,
                title: "Empreendedorismo",
                copy: "Produtos a partir de novas ideias.",
              },
              {
                icon: Lightbulb,
                title: "Hobby & criatividade",
                copy: "Mais espaço para experimentar.",
              },
            ].map(({ icon: Icon, title, copy }, i) => (
              <div className="application" key={title}>
                <span className="application-index">0{i + 1}</span>
                <Icon size={26} strokeWidth={1.4} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
