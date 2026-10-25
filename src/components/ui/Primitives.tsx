import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Box, MessageCircle } from "lucide-react";
import { company, contactUrl, type ContactIntent } from "../../data/company";

export function Logo() {
  return (
    <a className="logo" href="#inicio" aria-label="TOP3D — início">
      {company.logo ? (
        <img
          src={company.logo}
          alt="Logo original TOP3D Filamentos"
          width="100"
          height="100"
        />
      ) : (
        <>
          <span className="logo-mark">
            <Box size={31} strokeWidth={1.7} />
          </span>
        </>
      )}
      <span>
        TOP<span className="text-accent">3D</span>
        <small>FILAMENTOS & POSSIBILIDADES</small>
      </span>
    </a>
  );
}
export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
export function ContactButton({
  children = "Falar com especialista",
  className = "",
  product,
  intent,
  material,
  answers,
}: {
  children?: ReactNode;
  className?: string;
  product?: string;
  intent?: ContactIntent;
  material?: string;
  answers?: Record<string, string>;
}) {
  return (
    <ExternalLink
      href={contactUrl({ intent, productName: product, material, answers })}
      className={`button ${className}`}
    >
      <MessageCircle size={17} />
      {children}
      <ArrowUpRight size={16} />
    </ExternalLink>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
