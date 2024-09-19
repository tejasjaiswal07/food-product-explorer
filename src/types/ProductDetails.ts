import { Product } from './Product'; // Adjust the path as necessary

export interface ProductDetails extends Product {
    nutriments: {
      name: string;

      energy_100g: number;
      fat_100g: number;
      carbohydrates_100g: number;
      proteins_100g: number;
    };
    labels: string[];
  }
