import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faq } from "../../data/faq";
import { ContactButton, Reveal, SectionHeading } from "../ui/Primitives";
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="section container faq-grid">
      <Reveal>
        <SectionHeading
          eyebrow="BORA DESCOMPLICAR?"
          title={
            <>
              Boas perguntas.
              <br />
              <span className="text-muted">Novas possibilidades.</span>
            </>
          }
          description="Algumas respostas para você dar o próximo passo com mais clareza."
        />
        <ContactButton className="text-link" intent="faq">
          Ainda tem dúvidas? Fale com a TOP3D
        </ContactButton>
      </Reveal>
      <Reveal>
        <div className="faq-list">
          {faq.map(([q, a], i) => (
            <article
              className={`faq-item ${open === i ? "is-open" : ""}`}
              key={q}
            >
              <h3>
                <button
                  aria-expanded={open === i}
                  aria-controls={`faq-${i}`}
                  id={`faq-button-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{q}</span>
                  <Plus size={19} />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    id={`faq-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
