import { Instagram, ArrowUpRight } from "lucide-react";
import { company, contactUrl } from "../../data/company";
import { Logo, ExternalLink } from "../ui/Primitives";
export default function Footer() {
  return (
    <>
      <footer className="site-footer container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Tecnologia, criatividade e novas
              <br />
              dimensões para as suas ideias.
            </p>
            <ExternalLink href={company.instagram} className="footer-instagram">
              <Instagram size={18} />
              <span>@top3dd</span>
              <ArrowUpRight size={15} />
            </ExternalLink>
          </div>
          <div>
            <h3>Explore</h3>
            <a href="#inicio">Início</a>
            <a href="#produtos">Produtos</a>
            <a href="#sobre">Sobre a TOP3D</a>
          </div>
          <div>
            <h3>Aprenda & crie</h3>
            <a href="#categorias">Conheça os materiais</a>
            <a href="#guia">Qual filamento escolher?</a>
            <a href="#duvidas">Dúvidas frequentes</a>
          </div>
          <div>
            <h3>Vamos conversar</h3>
            <ExternalLink href={company.instagram}>
              Instagram
              <ArrowUpRight size={14} />
            </ExternalLink>
            {company.whatsapp && (
              <ExternalLink href={contactUrl({ intent: "footer" })}>
                WhatsApp · (41) 99776-5420
                <ArrowUpRight size={14} />
              </ExternalLink>
            )}
            {company.email && (
              <a href={`mailto:${company.email}`}>{company.email}</a>
            )}
            {company.address && <p>{company.address}</p>}
            {company.openingHours && <p>{company.openingHours}</p>}
            <p className="footer-contact-note">
              Consulte produtos e condições
              <br />
              pelo WhatsApp.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} TOP3D. Todos os direitos reservados.
          </span>
          <span>
            {company.privacyUrl && (
              <ExternalLink href={company.privacyUrl}>
                Política de Privacidade
              </ExternalLink>
            )}
            {company.termsUrl && (
              <ExternalLink href={company.termsUrl}>Termos de Uso</ExternalLink>
            )}
            FEITO PARA IDEIAS QUE VÃO ALÉM.
            <span className="status-dot" />
          </span>
        </div>
      </footer>
      <div className="floating-contact">
        <a
          href={contactUrl({ intent: "floating" })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          aria-describedby="whatsapp-status"
        >
          <img
            src="/whatsapp.svg"
            alt=""
            width="24"
            height="24"
            style={{ filter: "invert(1)" }}
          />
        </a>
        <span id="whatsapp-status" role="tooltip">
          Fale com a TOP3D pelo WhatsApp
        </span>
      </div>
    </>
  );
}
