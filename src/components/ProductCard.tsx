import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-2">Category: {product.category}</p>
        <p className="text-gray-600 mb-2">Ingredients: {product.ingredients.join(', ')}</p>
        <p className="text-gray-600">Nutrition Grade: {product.nutrition_grade.toUpperCase()}</p>
      </div>
    </Link>
  );
};

export default ProductCard;