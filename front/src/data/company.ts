export function normalizeWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 ? `55${digits}` : digits;
}

export const company = {
  name: "TOP3D",
  instagram: "https://www.instagram.com/top3dd/",
  whatsapp: normalizeWhatsApp(
    import.meta.env?.VITE_WHATSAPP_NUMBER?.trim() || "5541997765420",
  ),
  siteUrl: import.meta.env?.VITE_SITE_URL?.trim() || "",
  email: "",
  address: "",
  openingHours: "",
  logo: "/images/top3d-logo.webp",
  description: "Tecnologia para transformar ideias em realidade.",
  privacyUrl: "",
  termsUrl: "",
};
export const contactMessages = {
  specialist:
    "Olá! Vim pelo site da TOP3D e gostaria de falar com um especialista para escolher o filamento ideal para o meu projeto.",
  catalog:
    "Olá! Estou explorando o catálogo no site da TOP3D. Poderiam me enviar as opções de filamentos, marcas, cores e valores disponíveis?",
  options:
    "Olá! Vi a vitrine de filamentos no site da TOP3D e gostaria de consultar as opções disponíveis para o meu próximo projeto.",
  faq: "Olá! Li as dúvidas frequentes no site da TOP3D e ainda preciso de uma orientação sobre filamentos e impressão 3D. Podem me ajudar?",
  contact:
    "Olá, equipe TOP3D! Vim pelo site e quero tirar uma ideia do papel. Gostaria de ajuda para escolher o filamento e saber como comprar.",
  floating:
    "Olá! Conheci a TOP3D pelo site e gostaria de receber mais informações sobre os filamentos disponíveis.",
  footer:
    "Olá! Encontrei o contato da TOP3D no site e gostaria de informações sobre atendimento, produtos e condições de entrega.",
  material:
    "Olá! Consultei o guia de materiais no site da TOP3D e gostaria de orientação para escolher meu filamento.",
  project:
    "Olá! Fiz o assistente de materiais no site da TOP3D e gostaria de conversar sobre meu projeto.",
};
export type ContactIntent = keyof typeof contactMessages;
interface ContactOptions {
  intent?: ContactIntent;
  productName?: string;
  material?: string;
  answers?: Record<string, string>;
}
export function contactUrl({
  intent = "specialist",
  productName,
  material,
  answers,
}: ContactOptions = {}) {
  let message = productName
    ? `Olá! Vim pelo site da TOP3D e gostaria de consultar a disponibilidade, as cores e o valor do filamento ${productName}.`
    : contactMessages[intent];
  if (material)
    message +=
      intent === "project"
        ? ` O assistente sugeriu: ${material}. Gostaria de confirmar a escolha e conhecer as opções disponíveis.`
        : ` Tenho interesse em ${material}. Quais opções, cores e valores vocês têm disponíveis?`;
  if (answers) {
    const labels: Record<string, string> = {
      purpose: "O que pretendo imprimir",
      resistant: "Precisa suportar esforço",
      flexible: "Precisa ser flexível",
      outdoor: "Uso externo",
      experience: "Minha experiência",
    };
    message += Object.entries(answers)
      .filter(([key]) => labels[key])
      .map(([key, value]) => `\n${labels[key]}: ${value}`)
      .join("");
  }
  return /^\d{10,15}$/.test(company.whatsapp)
    ? `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`
    : company.instagram;
}
