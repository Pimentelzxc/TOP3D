import type { Material } from "../types";
export const materials: Material[] = [
  {
    id: "pla",
    image: "/images/material-pla.webp",
    imageAlt:
      "Fotografia de vasos e objetos decorativos impressos em PLA cinza, por Prusa Research",
    imageSource: "https://help.prusa3d.com/article/pla_2062",
    imageSubject: "Vasos e objetos decorativos",
    name: "PLA",
    subtitle: "O começo de grandes ideias.",
    color: "#e2b12b",
    description:
      "Detalhes que encantam, cores que inspiram. Uma opção versátil para dar os primeiros passos e criar peças com ótimo acabamento.",
    ease: "Alta",
    strength: "Moderada",
    flexibility: "Baixa",
    heat: "Baixa",
    uses: "Decoração, maquetes e protótipos visuais.",
    note: "Evite calor e aplicações externas exigentes.",
  },
  {
    id: "petg",
    image: "/images/material-petg.webp",
    imageAlt:
      "Fotografia de grampos e suportes funcionais impressos em PETG laranja, por Prusa Research",
    imageSource: "https://help.prusa3d.com/article/petg_2059",
    imageSubject: "Grampos e suportes funcionais",
    name: "PETG",
    subtitle: "Da ideia à função.",
    color: "#f9e7ce",
    description:
      "Um equilíbrio entre facilidade de impressão e tenacidade para tirar projetos funcionais do papel.",
    ease: "Intermediária",
    strength: "Boa tenacidade",
    flexibility: "Baixa a moderada",
    heat: "Superior ao PLA",
    uses: "Suportes, organizadores e protótipos funcionais.",
    note: "Ajuste a retração e mantenha o material seco. Uso externo depende da formulação e da exposição.",
  },
  {
    id: "abs",
    image: "/images/material-abs.webp",
    imageAlt:
      "Fotografia de modelos de sapos impressos em ABS laranja com acabamento alisado, por Prusa Research",
    imageSource: "https://help.prusa3d.com/article/abs_2058",
    imageSubject: "Modelos com acabamento alisado",
    name: "ABS",
    subtitle: "Para ir além do básico.",
    color: "#d0a575",
    description:
      "Um material técnico para quem precisa de resistência ao impacto e ao calor e já conhece os cuidados da impressão.",
    ease: "Exige experiência",
    strength: "Boa resistência ao impacto",
    flexibility: "Baixa",
    heat: "Elevada frente ao PLA",
    uses: "Carcaças, encaixes e protótipos técnicos.",
    note: "Requer controle de temperatura, ambiente apropriado e ventilação. Câmara fechada é recomendada.",
  },
  {
    id: "tpu",
    image: "/images/material-tpu.webp",
    imageAlt:
      "Fotografia de pneus flexíveis para carros de controle remoto impressos em TPU 95A, por Prusa Research",
    imageSource:
      "https://blog.prusa3d.com/prusament-tpu-95a-now-thats-a-flex_115316/",
    imageSubject: "Pneus flexíveis para modelos RC",
    name: "TPU",
    subtitle: "Abra espaço para a flexibilidade.",
    color: "#ba9c62",
    description:
      "Novas possibilidades para peças que precisam dobrar, absorver impactos e acompanhar o movimento.",
    ease: "Exige ajustes",
    strength: "Boa resistência à abrasão",
    flexibility: "Alta, conforme dureza",
    heat: "Depende da formulação",
    uses: "Amortecedores, capas e peças flexíveis.",
    note: "Verifique o sistema de extrusão e a dureza Shore. Imprima mais devagar e mantenha o filamento seco.",
  },
];
