export type ProductCategory = 'hogar' | 'oficina' | 'tecnologia' | 'bienestar';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  category: ProductCategory;
  imageUrl: string;
  features: string[];
}
