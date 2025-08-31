"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Star, ShoppingCart, Filter, Grid, List, Search, Heart } from 'lucide-react';
import Footer from '../Footer';
import Navbar from '../Navbar';

// Product type definition based on API response
interface Product {
  productSeq: number;
  product_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  about_in_bullets: string[];
  image_gallery: string[];
  price: number;
  brand: string;
  vendorID: string;
  raiting: number;
  reviewNumbers: number;
  reviews: any;
  quantity: number;
  discountPercent: number | null;
  discountPrice: number | null;
  variants: any;
  variantState: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mapped product interface for component usage
interface MappedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  slug: string;
  brand: string;
  aboutBullets: string[];
  quantity: number;
  discountPercent: number | null;
  discountPrice: number | null;
  featured: boolean;
}

// API Response interface
interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

interface CompletePageProps {
  category?: string;
}

interface ProductCardProps {
  product: MappedProduct;
}


function CompletePage({ category = 'indoor-plants' }: CompletePageProps) {
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://backend-server.developer-plantomart.workers.dev/product/on-category/${category}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      console.log('API Response:', data);
      
      // Map API data to component expected format
      const mappedProducts: MappedProduct[] = (data.data || []).map((product: Product) => ({
        id: product.productSeq,
        name: product.title,
        price: product.price,
        image: product.image_gallery?.[0] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
        rating: product.raiting || 4.0,
        reviews: product.reviewNumbers || 0,
        description: product.description,
        category: product.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Plants',
        slug: product.slug,
        brand: product.brand,
        aboutBullets: product.about_in_bullets || [],
        quantity: product.quantity,
        discountPercent: product.discountPercent,
        discountPrice: product.discountPrice,
        featured: product.featured
      }));
      
      setProducts(mappedProducts);
      console.log('Mapped products:', mappedProducts);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId: number): void => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const filteredAndSortedProducts = products
    .filter(product => 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

  const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-100">
      <div className="relative overflow-hidden">
        <div className="relative w-full h-64">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
        >
          <Heart 
            className={`h-5 w-5 ${favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
          />
        </button>
        <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {product.category}
        </div>
      </div>
      
      <div className="p-6">
        <Link href={`/products/${product.slug}`} className="block group">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {product.rating.toFixed(1)} ({product.reviews} reviews)
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-emerald-700">
            ₹{product.price.toFixed(2)}
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 group">
            <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem: React.FC<ProductCardProps> = ({ product }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-emerald-100">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-48 h-48 sm:h-auto overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 192px"
          />
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
          >
            <Heart 
              className={`h-4 w-4 ${favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
            />
          </button>
        </div>
        
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <Link href={`/products/${product.slug}`} className="block group">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">
              {product.description}
            </p>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-emerald-700">
              ${product.price.toFixed(2)}
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 group">
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-emerald-700 text-lg font-medium">Growing your garden...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Leaf className="h-12 w-12 text-emerald-200" />
              <h1 className="text-5xl md:text-6xl font-bold">PlantoMart</h1>
            </div>
            <p className="text-xl md:text-2xl font-light text-emerald-100 mb-8 max-w-3xl mx-auto">
              Discover Beautiful {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} for Your Space
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-emerald-100">🌱 Grown with Love • 🚚 Fast Delivery • 💚 Plant Care Support</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-emerald-50 to-transparent"></div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            
            {/* Sort and View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-emerald-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-emerald-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <div className="flex items-center bg-emerald-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-200'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-200'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-red-600">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold">Unable to fetch products</h3>
                <p className="text-red-600 text-sm mt-1">
                  {error}. Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <p className="text-gray-600">
              {filteredAndSortedProducts.length} beautiful plants found
            </p>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "space-y-6"
          }>
            {filteredAndSortedProducts.map((product) =>
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <ProductListItem key={product.id} product={product} />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <Leaf className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No plants found</h3>
              <p className="text-gray-600">
                {searchTerm ? 
                  `No plants match "${searchTerm}". Try a different search term.` :
                  'No products available in this category yet.'
                }
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Why Choose PlantoMart?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h4>
              <p className="text-gray-600">Hand-selected plants from trusted growers, ensuring healthy and vibrant additions to your space.</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Expert Care</h4>
              <p className="text-gray-600">Comprehensive care guides and ongoing support to help your plants thrive in their new home.</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Secure packaging and quick shipping to ensure your plants arrive safely and ready to flourish.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
    <Footer />
    </>
  );
}

export default CompletePage;