import { testimonials } from "../../data/testimonials";
import { ExternalLink, SectionHeading } from "../ui/Primitives";
export default function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="QUEM CRIA COM A GENTE"
        title="Experiências que inspiram."
      />
      <div className="testimonial-grid">
        {testimonials.map((t) => (
          <figure key={t.sourceUrl}>
            <blockquote>{t.comment}</blockquote>
            <figcaption>
              {t.name}
              {t.rating !== undefined && ` · ${t.rating}/5`}
              <ExternalLink href={t.sourceUrl}>
                Ver avaliação original
              </ExternalLink>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
