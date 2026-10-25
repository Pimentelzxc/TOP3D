export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  color?: string;
  colorHex?: string;
  weight?: string;
  diameter?: string;
  description: string;
  image: string;
  price?: number;
  productUrl?: string;
  available?: boolean;
  verified: boolean;
  sourceUrl: string;
  published?: boolean;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Material {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  image: string;
  imageAlt: string;
  imageSource: string;
  imageSubject: string;
  ease: string;
  strength: string;
  flexibility: string;
  heat: string;
  uses: string;
  note: string;
}
