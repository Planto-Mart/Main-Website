"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ShoppingCart, Loader2, AlertCircle, Check, Package } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import ProductDataType from '@/types/ProductData';

interface BundlesProductCombinerProps {
  slug: string;
}

interface ProductCombination {
  id: number;
  combination_id: string;
  parent_product_id: string;
  combination_name: string;
  description: string;
  child_products: {
    product_id: string;
    quantity: number;
  }[];
  created_at: string;
  updated_at: string;
}

interface CombinationApiResponse {
  success: boolean;
  message: string;
  data: ProductCombination[];
  count: number;
}

interface ProductApiResponse {
  success: boolean;
  message: string;
  data: ProductDataType;
}

interface BundleProduct extends ProductDataType {
  isSelected: boolean;
  bundleQuantity: number;
}

const BundlesProductCombiner: React.FC<BundlesProductCombinerProps> = ({ slug }) => {
  const [parentProduct, setParentProduct] = useState<ProductDataType | null>(null);
  const [combinations, setCombinations] = useState<ProductCombination[]>([]);
  const [bundleProducts, setBundleProducts] = useState<BundleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);

  // Fetch parent product by slug
  const fetchParentProduct = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.getProductBySlug(slug), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch parent product');
      }

      const result: ProductApiResponse = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Parent product not found');
      }

      setParentProduct(result.data);
      return result.data.product_id;
    } catch (err) {
      console.error('Error fetching parent product:', err);
      throw err;
    }
  };

  // Fetch product combinations
  const fetchProductCombinations = async (productId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.getCombinationsForProduct(productId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product combinations');
      }

      const result: CombinationApiResponse = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch combinations');
      }

      setCombinations(result.data || []);
      return result.data || [];
    } catch (err) {
      console.error('Error fetching combinations:', err);
      throw err;
    }
  };

  // Fetch individual product details
  const fetchProductDetails = async (productId: string): Promise<ProductDataType | null> => {
    try {
      const response = await fetch(API_ENDPOINTS.getProductById(productId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch product ${productId}`);
        return null;
      }

      const result: ProductApiResponse = await response.json();
      if (!result.success || !result.data) {
        console.warn(`Product ${productId} not found`);
        return null;
      }

      return result.data;
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      return null;
    }
  };

  // Fetch all bundle products
  const fetchBundleProducts = async (combinations: ProductCombination[]) => {
    if (combinations.length === 0) return;

    setProductsLoading(true);
    try {
      const allChildProducts = combinations.flatMap(combo => combo.child_products);
      const uniqueProductIds = [...new Set(allChildProducts.map(p => p.product_id))];

      const productPromises = uniqueProductIds.map(productId => fetchProductDetails(productId));
      const productResults = await Promise.all(productPromises);

      const validProducts = productResults.filter((product): product is ProductDataType => product !== null);
      
      // Map products with bundle information
      const bundleProductsData: BundleProduct[] = validProducts.map(product => {
        const childProduct = allChildProducts.find(cp => cp.product_id === product.product_id);
        return {
          ...product,
          isSelected: true, // Default to selected
          bundleQuantity: childProduct?.quantity || 1,
        };
      });

      setBundleProducts(bundleProductsData);
    } catch (err) {
      console.error('Error fetching bundle products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const productId = await fetchParentProduct();
        const combinationsData = await fetchProductCombinations(productId);
        await fetchBundleProducts(combinationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bundle information');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      initializeComponent();
    }
  }, [slug]);

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setBundleProducts(prev => 
      prev.map(product => 
        product.product_id === productId 
          ? { ...product, isSelected: !product.isSelected }
          : product
      )
    );
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0;
    
    // Add parent product price (use discounted price if available)
    if (parentProduct) {
      total += parentProduct.discountPrice || parentProduct.price;
    }
    
    // Add selected bundle products prices
    bundleProducts.forEach(product => {
      if (product.isSelected) {
        const productPrice = product.discountPrice || product.price;
        total += productPrice * product.bundleQuantity;
      }
    });
    
    return total;
  };

  // Calculate original total price (without discounts)
  const calculateOriginalTotalPrice = () => {
    let total = 0;
    
    if (parentProduct) {
      total += parentProduct.price;
    }
    
    bundleProducts.forEach(product => {
      if (product.isSelected) {
        total += product.price * product.bundleQuantity;
      }
    });
    
    return total;
  };

  // Calculate savings
  const calculateSavings = () => {
    const original = calculateOriginalTotalPrice();
    const discounted = calculateTotalPrice();
    return original - discounted;
  };

  // Get selected products count
  const getSelectedProductsCount = () => {
    return bundleProducts.filter(p => p.isSelected).length + 1; // +1 for parent product
  };

  // Handle add to cart
  const handleAddBundleToCart = () => {
    const selectedProducts = bundleProducts.filter(p => p.isSelected);
    console.log('Adding bundle to cart:', {
      parentProduct: parentProduct?.product_id,
      bundleProducts: selectedProducts.map(p => ({
        productId: p.product_id,
        quantity: p.bundleQuantity
      })),
      totalPrice: calculateTotalPrice()
    });
    // Implement your cart logic here
  };

  // Format Indian currency
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN');
  };

  // Get product image
  const getProductImage = (product: ProductDataType) => {
    let images: string[] = [];
    
    if (typeof product.image_gallery === 'string') {
      try {
        images = JSON.parse(product.image_gallery);
      } catch {
        images = [product.image_gallery];
      }
    } else if (Array.isArray(product.image_gallery)) {
      images = product.image_gallery.flat();
    }
    
    return images.length > 0 ? images[0] : '/assets/placeholder.jpg';
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <p className="text-gray-600">Loading bundle options...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Bundle</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No combinations available
  if (!combinations.length || !parentProduct) {
    return null; // Don't render anything if no bundles are available
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {combinations[0]?.combination_name || 'Bundle & Save'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {combinations[0]?.description || 'Get these products together at a discounted price'}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" />
            <span className="text-gray-600">Loading bundle products...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Products Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Parent Product - Always included */}
              <div className="lg:col-span-3">
                <div className="relative bg-gray-50 rounded-lg border-2 border-green-200 p-4">
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    This item
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 mb-3">
                      <Image
                        src={getProductImage(parentProduct)}
                        alt={parentProduct.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {parentProduct.title}
                    </h3>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{formatPrice(parentProduct.discountPrice || parentProduct.price)}
                      </span>
                      {parentProduct.discountPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{formatPrice(parentProduct.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plus Icon */}
              <div className="lg:col-span-1 flex items-center justify-center">
                <div className="bg-gray-100 rounded-full p-2">
                  <Plus className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Bundle Products */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bundleProducts.map((product, index) => (
                  <div key={product.product_id} className="relative">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        product.isSelected 
                          ? 'border-green-500 bg-green-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => toggleProductSelection(product.product_id)}
                    >
                      {/* Selection Checkbox */}
                      <div className="absolute top-2 left-2">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          product.isSelected 
                            ? 'bg-green-600 border-green-600' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {product.isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center pt-4">
                        <div className="relative w-20 h-20 mb-3">
                          <Image
                            src={getProductImage(product)}
                            alt={product.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{formatPrice(product.discountPrice || product.price)}
                          </span>
                          {product.discountPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{formatPrice(product.price)}
                            </span>
                          )}
                          {product.bundleQuantity > 1 && (
                            <span className="text-xs text-green-600 font-medium">
                              Qty: {product.bundleQuantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Plus icon between products (except last) */}
                    {index < bundleProducts.length - 1 && (
                      <div className="hidden sm:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="bg-gray-100 rounded-full p-1">
                          <Plus className="w-3 h-3 text-gray-600" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bundle Summary */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">Bundle Summary</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {getSelectedProductsCount()} items
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-900">
                        Total: ₹{formatPrice(calculateTotalPrice())}
                      </span>
                      {calculateSavings() > 0 && (
                        <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full font-medium">
                          Save ₹{formatPrice(calculateSavings())}
                        </span>
                      )}
                    </div>
                    
                    {calculateSavings() > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="line-through">₹{formatPrice(calculateOriginalTotalPrice())}</span>
                        <span className="ml-2 text-green-600 font-medium">
                          ({((calculateSavings() / calculateOriginalTotalPrice()) * 100).toFixed(0)}% off)
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddBundleToCart}
                    disabled={getSelectedProductsCount() <= 1}
                    className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add {getSelectedProductsCount()} to Cart
                  </button>
                  
                  <button
                    disabled={getSelectedProductsCount() <= 1}
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
                  >
                    Buy Bundle Now
                  </button>
                </div>
              </div>
            </div>

            {/* Individual Product Links */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Products in this bundle:</h4>
              <div className="flex flex-wrap gap-2">
                <Link 
                  href={`/product/${parentProduct.slug}`}
                  className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                >
                  {parentProduct.title}
                </Link>
                {bundleProducts.map(product => (
                  <Link
                    key={product.product_id}
                    href={`/product/${product.slug}`}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      product.isSelected
                        ? 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100'
                        : 'text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {product.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BundlesProductCombiner;