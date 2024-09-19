import { Product } from '../types/Product';

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const [field, order] = sortBy.split('_');
    return [...products].sort((a, b) => {
      if (field === 'name') {
        return order === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (field === 'grade') {
        return order === 'asc'
          ? a.nutrition_grade.localeCompare(b.nutrition_grade)
          : b.nutrition_grade.localeCompare(a.nutrition_grade);
      }
      return 0;
    });
  };
  