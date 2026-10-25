import { ArrowUpRight } from "lucide-react";
import { ContactButton, Reveal } from "../ui/Primitives";
export default function Contact() {
  return (
    <section id="contato" className="container contact-section">
      <Reveal className="contact-card">
        <div className="contact-copy">
          <div className="eyebrow">
            <span />
            PRONTO PARA TIRAR SUA IDEIA DO PAPEL?
          </div>
          <h2>
            Seu próximo projeto
            <br />
            começa com o<br />
            <span className="text-accent">filamento certo.</span>
          </h2>
          <p>
            Uma nova forma de criar está esperando por você.
            <br />
            Dê o próximo passo com a TOP3D.
          </p>
          <div className="hero-actions">
            <a href="#catalogo" className="button button-primary">
              Explorar catálogo
              <ArrowUpRight size={17} />
            </a>
            <ContactButton className="button-outline" intent="contact">
              Falar com a TOP3D
            </ContactButton>
          </div>
        </div>
        <img
          src="/images/hero-spools-gold.webp"
          width="600"
          height="600"
          loading="lazy"
          alt="Composição ilustrativa de bobinas de filamento"
        />
        <span className="contact-art-note">IMAGEM ILUSTRATIVA</span>
      </Reveal>
    </section>
  );
}
