"use client";
import React, { useState, useEffect } from 'react';
import { Package, Truck, FileText, Loader2, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import ProductDataType from '@/types/ProductData';

interface ProductDetailedDescriptionProps {
  slug: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ProductDataType;
}

// Enhanced markdown to HTML converter with better styling
const convertMarkdownToHTML = (markdown: string): string => {
  if (!markdown) return '';
  
  return markdown
    // Headers with improved styling
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6 border-b border-gray-200 pb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8 border-b-2 border-green-500 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8 border-b-2 border-blue-500 pb-3">$1</h1>')
    
    // Bold and italic with better contrast
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    
    // Code blocks with syntax highlighting simulation
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto my-4 border-l-4 border-blue-500"><code class="text-sm font-mono">$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border">$1</code>')
    
    // Enhanced links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors">$1</a>')
    
    // Styled blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-green-500 bg-green-50 pl-4 py-2 italic text-gray-700 my-4 rounded-r-lg">$1</blockquote>')
    
    // Enhanced lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2 text-gray-700 flex items-start"><span class="text-green-600 mr-2 mt-1">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-2 text-gray-700 flex items-start"><span class="text-blue-600 mr-2 font-medium">$1.</span><span>$2</span></li>')
    
    // Emoji support and special formatting
    .replace(/🌿|🌱|🪴/g, '<span class="text-green-600 text-lg">$&</span>')
    .replace(/💧|🌤|🔄/g, '<span class="text-blue-600 text-lg">$&</span>')
    .replace(/🚚|📍|🎁/g, '<span class="text-orange-600 text-lg">$&</span>')
    .replace(/❤️|💸|🧘/g, '<span class="text-red-500 text-lg">$&</span>')
    
    // Horizontal rules
    .replace(/^---$/gim, '<hr class="border-t-2 border-gray-300 my-8 mx-auto w-1/2"/>')
    
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    .replace(/\n/g, '<br/>')
    
    // Wrap content that's not already in HTML tags
    .replace(/^(?!<[h1-6]|<ul|<ol|<pre|<blockquote|<hr|<li)(.+)/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>');
};

const ProductDetailedDescription: React.FC<ProductDetailedDescriptionProps> = ({ slug }) => {
  const [product, setProduct] = useState<ProductDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping'>('description');

  const fetchProductBySlug = async () => {
    if (!slug) {
      setError('Product slug is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.getProductBySlug(slug), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch product details');
      }

      if (!result.data) {
        throw new Error('No product data received');
      }

      setProduct(result.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductBySlug();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <p className="text-gray-600">Loading product details...</p>
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
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Details</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchProductBySlug}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No product data
  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details Not Available</h3>
            <p className="text-gray-600">The detailed information for this product could not be loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'description'
                ? 'border-b-2 border-green-600 bg-white text-green-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'shipping'
                ? 'border-b-2 border-green-600 bg-white text-green-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            Shipping & Delivery
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
            </div>
            
            {product.content_description ? (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: convertMarkdownToHTML(product.content_description) 
                }}
              />
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No detailed description available for this product.</p>
              </div>
            )}

            {/* Fallback to regular description if content_description is empty */}
            {!product.content_description && product.description && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Product Summary</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
            </div>
            
            {product.content_shipping_delivery ? (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: convertMarkdownToHTML(product.content_shipping_delivery) 
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* Default shipping information when no content is available */}
                <div className="text-center py-8">
                  <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Detailed shipping information is not available for this product.</p>
                </div>
                
                {/* Fallback default shipping info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Standard Delivery
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Free shipping on orders above ₹499</li>
                      <li>• Delivery in 3-7 business days</li>
                      <li>• Secure packaging included</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Live Plant Care
                    </h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Plants shipped with care instructions</li>
                      <li>• Eco-friendly packaging</li>
                      <li>• Healthy arrival guarantee</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced styling for list items within tabs */}
      <style jsx global>{`
        .prose ul {
          @apply list-none space-y-2 my-4;
        }
        .prose ol {
          @apply list-none space-y-2 my-4;
        }
        .prose li {
          @apply flex items-start text-gray-700;
        }
        .prose li:before {
          @apply hidden;
        }
        .prose p {
          @apply mb-4 text-gray-700 leading-relaxed;
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          @apply text-gray-900 font-semibold;
        }
        .prose blockquote {
          @apply border-l-4 border-green-500 bg-green-50 pl-4 py-2 italic text-gray-700 my-4 rounded-r-lg;
        }
        .prose pre {
          @apply bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto my-4 border-l-4 border-blue-500;
        }
        .prose code {
          @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 border;
        }
        .prose hr {
          @apply border-t-2 border-gray-300 my-8 mx-auto w-1/2;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailedDescription;