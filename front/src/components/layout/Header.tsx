import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowUp, Instagram, Menu, X } from "lucide-react";
import { ContactButton, ExternalLink, Logo } from "../ui/Primitives";
import { company } from "../../data/company";
const links = [
  ["inicio", "Início"],
  ["produtos", "Produtos"],
  ["categorias", "Materiais"],
  ["sobre", "Sobre nós"],
  ["duvidas", "FAQ"],
  ["contato", "Contato"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    links.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", scroll);
      observer.disconnect();
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Navegação principal">
            {links.map(([id, label]) => (
              <a
                className={active === id ? "active" : ""}
                aria-current={active === id ? "location" : undefined}
                href={`#${id}`}
                key={id}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <ExternalLink href={company.instagram} className="navbar-instagram">
              <Instagram size={18} />
              <span className="sr-only">Instagram da TOP3D</span>
            </ExternalLink>
            <ContactButton className="header-contact" />
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="icon-button mobile-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              id="mobile-menu"
              className="mobile-nav"
              aria-label="Navegação mobile"
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
            >
              {links.map(([id, label]) => (
                <a onClick={() => setOpen(false)} href={`#${id}`} key={id}>
                  {label}
                </a>
              ))}
              <ContactButton />
            </motion.nav>
          )}
        </AnimatePresence>
        <motion.div className="reading-progress" style={{ scaleX: progress }} />
      </header>
      {scrolled && (
        <a
          className="back-top icon-button"
          href="#inicio"
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={18} />
        </a>
      )}
    </>
  );
}
