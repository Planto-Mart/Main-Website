/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect, useRef, useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, X, Search, ShieldCheck, Heart, MinusCircle, PlusCircle } from 'lucide-react';

import { supabase } from '@/utils/supabase/client';
// import  {ProductDataType,ProductVariantType } from '@/types/ProductData';
import ProductDataType from '@/types/ProductData';
import { ProductVariantType } from '@/types/ProductData';
import { API_ENDPOINTS } from '@/config/api';

interface HeroSectionProps {
  slug: string; // Changed from productId to slug since we'll use slug for routing
}

interface VendorData {
  id: number;
  slug: string;
  name: string;
  business_name: string;
  contact_person_name: string;
  contact_email: string;
  business_address: string;
  is_verified: number;
  status: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ slug }) => {
  const [product, setProduct] = useState<ProductDataType | null>(null);
  const [baseTitle, setBaseTitle] = useState<string>('');
  const [variants, setVariants] = useState<ProductVariantType[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorError, setVendorError] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const element_unique_id = useId();

  // Add this helper above the currentImageGallery definition
  const normalizeGallery = (gallery: any): string[] => {
    console.log('normalizeGallery input:', gallery);
    let arr: any[] = [];
    if (!gallery) return ['/assets/placeholder.jpg'];
    if (typeof gallery === 'string') {
      try {
        // Try to parse stringified JSON array
        const parsed = JSON.parse(gallery);
        if (Array.isArray(parsed)) arr = parsed;
        else arr = [gallery];
      } catch {
        arr = [gallery];
      }
    } else if (Array.isArray(gallery)) {
      arr = gallery.flat();
    } else {
      return ['/assets/placeholder.jpg'];
    }
    const valid = arr.filter(
      (img) =>
        typeof img === 'string' &&
        (
          img.startsWith('/') ||
          img.startsWith('http') ||
          img.startsWith('data:image/')
        )
    );
    console.log('normalizeGallery output:', valid);
    return valid.length > 0 ? valid : ['/assets/placeholder.jpg'];
  };

  // Derived: which image gallery to use (variant or product)
  const currentImageGallery = (() => {
    if (selectedVariant) {
      const v = variants.find(v => v.variant_id === selectedVariant);
      if (v) return normalizeGallery(v.image_gallery);
    }
    return normalizeGallery(product?.image_gallery);
  })();

  // Derived: which product info to display (variant or main)
  const displayProduct = (() => {
    if (selectedVariant) {
      const v = variants.find(v => v.variant_id === selectedVariant);
      if (v) {
        return {
          ...product!,
          price: v.price,
          discountPrice: v.discount_price,
          discountPercent: v.discount_percent,
          quantity: v.quantity,
          title: `${baseTitle} - ${v.variant_name}`,
          // Use main product's image_gallery as fallback if variant has none
          image_gallery: v.image_gallery && v.image_gallery.length > 0 ? v.image_gallery : product!.image_gallery,
        };
      }
    }
    return product!;
  })();

  // --- Price display helpers ---
  const getDisplayPrice = (p: typeof displayProduct) => p.discountPrice ?? p.price;
  const getStrikedPrice = (p: typeof displayProduct) => p.discountPrice ? p.price : undefined;

  // Fetch product by slug and get variants
  const fetchProductBySlug = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.getProductBySlug(slug), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch product');
      const json = await res.json();
      if (!json.success || !json.data) throw new Error(json.message || 'Product not found');
      setProduct(json.data);
      setBaseTitle(json.data.title); // Store the original title
      if (json.data.variants && Array.isArray(json.data.variants)) {
        setVariants(json.data.variants);
      } else {
        setVariants([]);
      }
      // Fetch vendor data for this product
      if (json.data.vendorID) {
        await fetchVendorData(json.data.vendorID);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      setProduct(null);
      setVariants([]);
      setBaseTitle('');
    } finally {
      setLoading(false);
    }
  };

  // Fetch vendor data by user UUID
  const fetchVendorData = async (vendorId: string) => {
    setVendorLoading(true);
    setVendorError(null);
    try {
      // First, try to get all vendors and find the one with matching vendor_id
      const allVendorsRes = await fetch(API_ENDPOINTS.getAllVendorsPublic);
      if (!allVendorsRes.ok) throw new Error('Failed to fetch vendors');
      const vendorsJson = await allVendorsRes.json();
      if (!vendorsJson.success || !Array.isArray(vendorsJson.data)) throw new Error('Vendors data error');
      
      const foundVendor = vendorsJson.data.find((v: any) => 
        v.vendor_id === vendorId || 
        v.id === vendorId || 
        v.user_uuid === vendorId
      );
      
      if (foundVendor) {
        setVendorData(foundVendor);
        return;
      }
      
      // If not found in public vendors, try to get user UUID and fetch vendor data
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setVendorError('Not authenticated.');
        return;
      }
      
      // Try to fetch vendor data using the user UUID
      const res = await fetch(API_ENDPOINTS.getVendorByUserUUID(session.user.id), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (res.ok) {
        const json = await res.json();
        if (!json.success || !json.data) throw new Error(json.message || 'Vendor not found');
         setVendorData(json.data);
      } else {
        setVendorError('Vendor not found');
      }
    } catch (err: any) {
      console.error('Failed to fetch vendor data:', err);
      setVendorError(err.message || 'Failed to fetch vendor data');
    } finally {
      setVendorLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProductBySlug();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // When selectedVariant changes, reset selectedImage
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant, currentImageGallery.length]);

  const handleQuantityChange = (increment: boolean) => {
    if (!product) return;
    
    if (increment && quantity < product.quantity) {
      setQuantity(quantity + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId);
    // Find and set the selected variant as the current product
    const selectedVariantObj = variants.find(v => v.variant_id === variantId);
    if (selectedVariantObj) {
      setProduct({
        ...product!,
        price: selectedVariantObj.price,
        discountPrice: selectedVariantObj.discount_price,
        discountPercent: selectedVariantObj.discount_percent,
        image_gallery: selectedVariantObj.image_gallery || product!.image_gallery,
        quantity: selectedVariantObj.quantity,
        title: `${baseTitle} - ${selectedVariantObj.variant_name}`,
        // Optionally, add more fields if needed
      });
      setSelectedImage(0); // Reset selected image when variant changes
      setQuantity(1); // Reset quantity when variant changes
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="size-4 fill-yellow-500 text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="size-4 fill-gray-300 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="size-4 fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="size-4 fill-gray-300 text-gray-300" />);
    }

    return stars;
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setMousePosition({ x, y });
    }
  };

  const closeMagnifier = () => {
    setShowMagnifier(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Implement your cart logic here
    console.log("Added to cart:", {
      product: product.product_id,
      variant: selectedVariant,
      quantity
    });
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    
    // Implement your wishlist logic here
    console.log("Added to wishlist:", product.product_id);
  };

  const formatIndianPrice = (price: number) => {
    return price.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <span className="inline-block animate-spin rounded-full bg-green-200 p-4 shadow-lg">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 8v4m8-8h-4M4 12H8" />
            </svg>
          </span>
          <h2 className="text-2xl font-bold text-green-700">Loading product details...</h2>
          <p className="text-green-600">Please wait while we grow your plant's details 🌱</p>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-red-50 to-green-50">
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <span className="inline-block rounded-full bg-red-200 p-4 shadow-lg">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
            </svg>
          </span>
          <h2 className="text-2xl font-bold text-red-700">Oops! Product not found</h2>
          <p className="text-red-600">{error}</p>
          <button type="button" onClick={fetchProductBySlug} className="mt-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">Retry</button>
        </div>
      </section>
    );
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-white text-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              {/** biome-ignore lint/a11y/noStaticElementInteractions: don't require it here */}
              <div 
                ref={imageRef}
                className="relative mb-4 aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <div className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1 shadow-sm">
                  <Search className="size-5 text-gray-500" />
                </div>
                <Image
                  src={currentImageGallery[selectedImage] || '/assets/placeholder.jpg'}
                  alt={displayProduct.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {currentImageGallery.map((img, index) => (
                  <button
                    type='button'
                    // biome-ignore lint/suspicious/noArrayIndexKey: don't need it here
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square h-16 shrink-0 overflow-hidden rounded-md border-2 ${
                      selectedImage === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img || '/assets/placeholder.jpg'}
                      alt={`${displayProduct.title} - view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
              {/* Image Magnifier Modal */}
              {showMagnifier && (
                <div className="fixed left-1/2 top-1/2 z-[9999] size-[350px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border-2 border-green-500 bg-white shadow-xl">
                  <button 
                    type='button'
                    onClick={closeMagnifier}
                    className="absolute right-2 top-2 z-10 rounded-full bg-white p-1 shadow-sm"
                  >
                    <X className="size-4 text-gray-600" />
                  </button>
                  <div 
                    className="size-full" 
                    style={{
                      backgroundImage: `url(${currentImageGallery[selectedImage] || '/assets/placeholder.jpg'})`,
                      backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                      backgroundSize: '250%',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Middle Column - Product Details */}
          <div className="lg:col-span-5">
            <h1 className="mb-2 text-xl font-bold text-blue-600 sm:text-2xl">{displayProduct.title}</h1>
            {/* Vendor & Rating */}
            <div className="mb-4">
              {vendorData ? (
                <Link href={`/vendor/store/${vendorData.slug}`} className="text-sm font-medium text-green-600 hover:underline">
                  Visit the {vendorData.name || vendorData.business_name || product.brand} Store
                </Link>
              ) : vendorLoading ? (
                <span className="text-sm text-gray-500">Loading vendor info...</span>
              ) : (
                <span className="text-sm text-gray-500">{product.brand} Store</span>
              )}
              <div className="mt-1 flex items-center">
                <div className="flex items-center">
                  {renderStars(product.raiting)}
                  <span className="ml-1 text-sm text-gray-600">{product.raiting}/5</span>
                </div>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-sm text-gray-600">{product.reviewNumbers.toLocaleString()} ratings</span>
              </div>
            </div>
            {/* Price */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-gray-800">₹{formatIndianPrice(getDisplayPrice(displayProduct))}</span>
                {getStrikedPrice(displayProduct) !== undefined && (
                  <>
                    <span className="ml-2 text-sm text-gray-500 line-through">₹{formatIndianPrice(getStrikedPrice(displayProduct)!)}</span>
                    {displayProduct.discountPercent && (
                      <span className="ml-2 text-sm font-medium text-green-600">-{displayProduct.discountPercent}%</span>
                    )}
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>
            </div>
            {/* Variants */}
            {product.variantState && variants.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-gray-600">Style Name:</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {variants.map((variant) => (
                    <button
                      type='button'
                      key={variant.variant_id}
                      onClick={() => handleVariantSelect(variant.variant_id)}
                      className={`flex flex-col rounded-md border p-2 text-left transition ${
                        selectedVariant === variant.variant_id 
                          ? 'border-green-600 bg-green-50 ring-1 ring-green-600' 
                          : 'border-gray-200 bg-white hover:border-green-600'
                      }`}
                    >
                      <span className="text-xs font-medium text-gray-600">{variant.variant_name}</span>
                      <span className="mt-1 text-sm font-bold text-gray-800">₹{formatIndianPrice(variant.discount_price ?? variant.price)}</span>
                      {variant.discount_price && (
                        <span className="text-xs text-gray-500 line-through">₹{formatIndianPrice(variant.price)}</span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <button
                    type="button"
                    onClick={() => setSelectedVariant(null)}
                    className="mt-2 px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Show main product
                  </button>
                )}
              </div>
            )}
            {/* About This Item */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium text-blue-600">About this item</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {product.about_in_bullets.map((bullet, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: not needed here
                    <li key={index} className="flex">
                    <span className="mr-2 mt-1 text-green-600">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right Column - Buy Box */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
              <div className="mb-4">
                <span className="text-xl font-bold text-gray-800">₹{formatIndianPrice(getDisplayPrice(displayProduct))}</span>
                {getStrikedPrice(displayProduct) !== undefined && (
                  <div className="mt-1">
                    <span className="text-sm text-gray-500 line-through">₹{formatIndianPrice(getStrikedPrice(displayProduct)!)}</span>
                    {displayProduct.discountPercent && (
                      <span className="ml-2 text-sm font-medium text-green-600">Save {displayProduct.discountPercent}%</span>
                    )}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">FREE delivery <span className="font-bold text-gray-700">Tuesday, 27 May</span></p>
              </div>
              <div className="mb-4 flex items-center text-sm">
                <span className={`font-medium ${displayProduct.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {displayProduct.quantity > 0 ? 'In stock' : 'Out of stock'}
                </span>
              </div>
              {/* Quantity Selector */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-600">
                  Quantity:
                </label>
                <div className="mt-1 flex items-center">
                  <button
                    type='button'
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                    className="rounded-md p-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MinusCircle className="size-5" />
                  </button>
                  <input
                    type="text"
                    id={element_unique_id}
                    value={quantity}
                    readOnly
                    className="w-12 border-0 bg-transparent text-center text-sm text-gray-800"
                  />
                  <button
                    type='button'
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= displayProduct.quantity}
                    className="rounded-md p-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PlusCircle className="size-5" />
                  </button>
                </div>
              </div>
              {/* Add to Cart Button */}
              <button
                type='button'
                onClick={handleAddToCart}
                disabled={displayProduct.quantity <= 0}
                className="mb-2 w-full rounded-full bg-yellow-400 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to Cart
              </button>
              {/* Buy Now Button */}
              <button
                type='button'
                disabled={displayProduct.quantity <= 0}
                className="mb-4 w-full rounded-full bg-orange-500 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy Now
              </button>
              {/* Add to Wishlist */}
              <div className="mb-4 flex items-center">
                <input
                  id={element_unique_id}
                  type="checkbox"
                  className="size-4 rounded border-gray-300 bg-white text-green-600 focus:ring-green-500"
                />
                <label htmlFor="add-gift-options" className="ml-2 text-sm text-gray-600">
                  Add gift options
                </label>
              </div>
              <button
                type='button'
                onClick={handleAddToWishlist}
                className="mb-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
              >
                <Heart className="mr-2 size-4" />
                Add to Wish List
              </button>
              {/* Secure Transaction */}
              <div className="flex items-center text-xs text-gray-500">
                <ShieldCheck className="mr-1 size-4" />
                <span>Secure transaction</span>
              </div>
              {/* Shipping Info */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex">
                  <span className="w-20 font-medium text-gray-500">Ships from</span>
                  <span className="text-gray-700">PlantoMart</span>
                </div>
                <div className="flex">
                  <span className="w-20 font-medium text-gray-500">Sold by</span>
                  {vendorData ? (
                    <span className="text-green-600 hover:underline">
                      <Link href={`/vendor/${vendorData.slug}`}>
                        {vendorData.name || vendorData.business_name || product.brand}
                      </Link>
                    </span>
                  ) : (
                    <span className="text-gray-700">{product.brand}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;