export interface Brand {
  id: string;
  name: string;
  logo: string;
  image: string;
  imageAlt: string;
  heading: string;
  description: string;
  materials: string[];
  website: string;
  photoSource: string;
  origin: string;
}
export const brands: Brand[] = [
  {
    id: "multfila",
    name: "Multfila",
    logo: "/images/brands/multfila-logo.webp",
    image: "/images/brands/multfila-photo.webp",
    imageAlt:
      "Bobina de filamento Multfila dourado e peça impressa em formato de cacto",
    heading: "Mais cores para dar forma ao que você imagina.",
    description:
      "A Multfila reúne filamentos, equipamentos e acessórios para impressão 3D. Seu portfólio inclui materiais do dia a dia e acabamentos como Silk, Matte e Multicolor.",
    materials: ["PLA", "PETG", "TPU", "ABS", "Acabamentos especiais"],
    website: "https://multfila.com.br/",
    photoSource: "https://maker.artbox3d.com.br/filamentos/multfila/",
    origin: "Portfólio de materiais e acabamentos",
  },
  {
    id: "brothers",
    name: "3D Brothers",
    logo: "/images/brands/brothers-logo.webp",
    image: "/images/brands/brothers-photo.webp",
    imageAlt: "Bobina de filamento PLA preto da 3D Brothers",
    heading: "Fabricação brasileira. Possibilidades sem fronteiras.",
    description:
      "Fabricante brasileira sediada em Curitiba, a 3D Brothers produz filamentos PLA, PETG e ABS. A marca também reúne opções de cores sólidas e acabamentos Silk.",
    materials: ["PLA", "PETG", "ABS", "PLA Silk"],
    website: "https://3dbrothers.com.br/sobre/",
    photoSource:
      "https://3dbrothers.com.br/produtos/filamento-3d-pla-premium-175-mm-preto-n7thj/",
    origin: "Fabricante brasileira · Curitiba, PR",
  },
  {
    id: "voolt",
    name: "Voolt3D",
    logo: "/images/brands/voolt-logo.webp",
    image: "/images/brands/voolt-photo.webp",
    imageAlt:
      "Bobina de filamento PLA dourado V-Silk da Voolt3D e dragão impresso",
    heading: "O acabamento também faz parte da sua ideia.",
    description:
      "A Voolt3D oferece filamentos com diferentes cores e efeitos visuais. Entre as linhas do seu portfólio estão PLA Velvet, V-Silk e PETG HF, para explorar do aspecto fosco ao brilho.",
    materials: ["PLA Velvet", "PLA V-Silk", "PETG HF"],
    website: "https://voolt3d.com.br/",
    photoSource:
      "https://voolt3d.com.br/produtos/filamento-pla-dourado-v-silk-premium/",
    origin: "Cores, texturas e acabamentos",
  },
  {
    id: "prime",
    name: "3D Prime",
    logo: "/images/brands/prime-logo.webp",
    image: "/images/brands/prime-photo.webp",
    imageAlt: "Bobina de filamento PLA Basic branco da 3D Prime",
    heading: "Do primeiro modelo ao próximo desafio.",
    description:
      "A 3D Prime reúne filamentos e soluções para impressão 3D. Seu catálogo inclui linhas como PLA Basic e PLA Premium HT High Speed, além de materiais para diferentes aplicações.",
    materials: ["PLA Basic", "PLA Premium HT", "Materiais técnicos"],
    website: "https://3dprime.com.br/",
    photoSource: "https://3dprime.com.br/",
    origin: "Soluções e materiais para impressão 3D",
  },
  {
    id: "elegoo",
    name: "ELEGOO",
    logo: "/images/brands/elegoo-logo.webp",
    image: "/images/brands/elegoo-photo.webp",
    imageAlt:
      "Bobina ELEGOO Silk PLA em azul e violeta ao lado de um vaso impresso",
    heading: "Novas combinações para criar em outra dimensão.",
    description:
      "A ELEGOO desenvolve impressoras e materiais para impressão 3D. A linha de filamentos oferece PLA, PETG e outras formulações, incluindo opções Silk e materiais flexíveis.",
    materials: ["PLA", "PETG", "Silk PLA", "TPU"],
    website: "https://us.elegoo.com/pages/elegoo-filaments",
    photoSource: "https://us.elegoo.com/collections/filaments",
    origin: "Impressoras e materiais para impressão 3D",
  },
];
export const brandNames = brands.map((brand) => brand.name);
export const materialOptions = [
  "PLA",
  "PLA+",
  "PETG",
  "ABS",
  "ASA",
  "TPU",
  "PLA Silk",
  "PLA Matte",
  "PLA Rainbow",
  "Especial",
];
