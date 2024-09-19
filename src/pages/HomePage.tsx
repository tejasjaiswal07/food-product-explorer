import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { api } from '../services/api';
import { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortSelect from '../components/SortSelect';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (reset: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProducts = await api.getProducts(reset ? 1 : page);
      setProducts((prevProducts) => (reset ? newProducts : [...prevProducts, ...newProducts]));
      setPage((prevPage) => (reset ? 2 : prevPage + 1));
      setHasMore(newProducts.length > 0);
    } catch (error) {
      setError('Error fetching products. Please try again later.');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);

  const fetchCategories = async () => {
    try {
      const categories = await api.getCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await api.searchProducts(query);
      setProducts(searchResults);
      setHasMore(false);
    } catch (error) {
      setError('Error searching products. Please try again later.');
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Implement category filtering logic here
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    // Implement sorting logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Food Product Explorer</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <SortSelect onSortChange={handleSortChange} />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <InfiniteScroll
        dataLength={products.length}
        next={() => fetchProducts(false)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </InfiniteScroll>
      {isLoading && <div className="text-center mt-4">Loading...</div>}
    </div>
  );
};

export default HomePage;