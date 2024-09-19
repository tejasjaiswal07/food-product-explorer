import axios from 'axios';
import { Product } from '../types/Product';
import { ProductDetails } from '../types/ProductDetails'; 

const BASE_URL = 'https://world.openfoodfacts.org';




const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
});




axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(axiosInstance(error.config)), 5000); 
      });
    }
    return Promise.reject(error);

  }
);

export const api = {
  getProducts: async (
    page: number = 1,
    pageSize: number = 20,
    category?: string,
    sortBy?: string
  ): Promise<Product[]> => {
    try {
      const params: any = {
        json: true,
        page,
        page_size: pageSize,
        action: 'process',
      };

      if (category) {
        params.tagtype_0 = 'categories';
        params.tag_contains_0 = 'contains';
        params.tag_0 = category;
      }

      if (sortBy) {
        const [field, order] = sortBy.split('_');
        params.sort_by = field;
        params.sort_order = order === 'desc' ? 'desc' : 'asc';
      }

      const response = await axiosInstance.get('/cgi/search.pl', { params });
      return response.data.products.map((product: any) => ({
        id: product.code,
        name: product.product_name,
        image_url: product.image_url,
        category: product.categories_tags[0],
        ingredients: product.ingredients_text_en?.split(',') || [],
        nutrition_grade: product.nutrition_grade_fr,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await axiosInstance.get('/cgi/search.pl', {
        params: {
          search_terms: query,
          json: true,
        },
      });
      return response.data.products.map((product: any) => ({
        id: product.code,
        name: product.product_name,
        image_url: product.image_url,
        category: product.categories_tags[0],
        ingredients: product.ingredients_text_en?.split(',') || [],
        nutrition_grade: product.nutrition_grade_fr,
      }));
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

 getProductByBarcode: async (barcode: string): Promise<ProductDetails> => {
    const response = await axios.get(`${BASE_URL}/api/v0/product/${barcode}.json`);
    const product = response.data.product;
    return {
      id: product.code,
      name: product.product_name,
      image_url: product.image_url,
      category: product.categories_tags[0],
      ingredients: product.ingredients_text_en?.split(',') || [],
      nutrition_grade: product.nutrition_grade_fr,
      nutriments: {
        name: product.product_name,
        energy_100g: product.nutriments.energy_100g,
        fat_100g: product.nutriments.fat_100g,
        carbohydrates_100g: product.nutriments.carbohydrates_100g,
        proteins_100g: product.nutriments.proteins_100g,
      },
      labels: product.labels_tags || [],
    };
  },

  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(`${BASE_URL}/categories.json`);
    return response.data.tags.map((tag: any) => tag.name);
  },
};


