import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Box,
  Layers3,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { Reveal } from "../ui/Primitives";
export default function Hero() {
  const reduced = useReducedMotion();
  return (
    <section id="inicio" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <Reveal>
            <div className="eyebrow">
              <span />
              TECNOLOGIA EM IMPRESSÃO 3D
            </div>
            <h1>
              Dê vida às
              <br />
              suas ideias
              <br />
              com a{" "}
              <span className="hero-brand">
                TOP3D<span className="text-accent">.</span>
                <svg viewBox="0 0 290 16" aria-hidden="true">
                  <path d="M3 11Q140-2 285 9" />
                </svg>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hero-description">
              Sua próxima grande criação começa aqui.
              <br className="desktop-break" /> Explore o universo da impressão
              3D e encontre
              <br className="desktop-break" /> novas possibilidades para os seus
              projetos.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="hero-actions">
              <a className="button button-primary" href="#produtos">
                Explorar filamentos
                <ArrowUpRightIcon />
              </a>
              <a className="button button-quiet" href="#sobre">
                Conheça a TOP3D
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="hero-notes">
              <span>
                <Layers3 size={15} />
                Uma camada de cada vez.
              </span>
              <span>
                <Sparkles size={15} />
                Infinitas possibilidades.
              </span>
            </div>
          </Reveal>
        </div>
        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.1 }}
          onPointerMove={(e) => {
            if (reduced || e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty(
              "--rx",
              `${(e.clientY - r.top - r.height / 2) / 65}deg`,
            );
            e.currentTarget.style.setProperty(
              "--ry",
              `${(e.clientX - r.left - r.width / 2) / 65}deg`,
            );
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.setProperty("--rx", "0deg");
            e.currentTarget.style.setProperty("--ry", "0deg");
          }}
        >
          <div className="technical-circle circle-one" />
          <div className="technical-circle circle-two" />
          <span className="art-coordinate">IDEIA → CAMADA → REALIDADE</span>
          <img
            className="hero-image"
            src="/images/hero-spools-gold.webp"
            width="1100"
            height="1100"
            alt="Composição conceitual de bobinas de filamento dourado, creme e preto"
            fetchPriority="high"
          />
          <div className="art-tag">
            <span className="tag-icon">
              <Layers3 size={19} />
            </span>
            <span>
              O material da sua próxima ideia.
              <small>EXPLORE. CRIE. TRANSFORME.</small>
            </span>
            <MoveUpRight size={16} />
          </div>
          <span className="art-caption">
            VISUAL CONCEITUAL · IMAGEM ILUSTRATIVA
          </span>
          <span className="crosshair crosshair-one">+</span>
          <span className="crosshair crosshair-two">+</span>
        </motion.div>
      </div>
      <div className="container hero-bottom">
        <span>
          <span className="status-dot" />
          DA PRIMEIRA CAMADA À ÚLTIMA IDEIA.
        </span>
        <a href="#categorias">
          Role para explorar
          <ArrowDown size={14} />
        </a>
      </div>
      <div className="material-ticker" aria-label="Inspiração em impressão 3D">
        <span>CRIATIVIDADE SEM LIMITES</span>
        <Box />
        <span>IDEIAS EM NOVAS DIMENSÕES</span>
        <Box />
        <span>CAMADA POR CAMADA</span>
        <Box />
        <span>FEITO PARA CRIAR</span>
        <Box />
      </div>
    </section>
  );
}
function ArrowUpRightIcon() {
  return <MoveUpRight size={18} />;
}
