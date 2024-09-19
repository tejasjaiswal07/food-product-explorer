import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api} from '../services/api';

import { ProductDetails } from '../types/ProductDetails';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        console.error('Product ID is undefined');
        return;
      }
      try {
        const details = await api.getProductByBarcode(id);
        setProduct(details);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.image_url} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
        <div>
          <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
          <p className="mb-2"><strong>Category:</strong> {product.category}</p>
          <p className="mb-2"><strong>Nutrition Grade:</strong> {product.nutrition_grade.toUpperCase()}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Ingredients</h3>
          <ul className="list-disc list-inside mb-4">
            {product.ingredients.map((ingredient: string, index: number) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">Nutritional Values (per 100g)</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Energy: {product.nutriments.energy_100g} kcal</li>
            <li>Fat: {product.nutriments.fat_100g}g</li>
            <li>Carbohydrates: {product.nutriments.carbohydrates_100g}g</li>
            <li>Proteins: {product.nutriments.proteins_100g}g</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">Labels</h3>
          <ul className="list-disc list-inside">
            {product.labels.map((label: string, index: number) => (
              <li key={index}>{label}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;