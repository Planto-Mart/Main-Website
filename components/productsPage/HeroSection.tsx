/* eslint-disable no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShieldCheck, MinusCircle, PlusCircle, X, Search } from 'lucide-react';

import type ProductDataType from '@/types/ProductData';

const mockProduct: ProductDataType = {
  id: "prod-001",
  slug: "money-plant-golden",
  title: "Ugaoo Indoor Plants for Living Room Home Decor Set of 4 Plant Combo Live Plant with Pot - Jade Plant, Money Plant Golden, Broken Heart Plant and Philodendron Oxycardium Green",
  description: "Bring nature indoors with this beautiful set of 4 indoor plants, perfect for home decor and purifying your living space.",
  category: "Indoor Plants",
  aboutInBullets: [
    "Carefully Curated Plant Combo, created to bring you the best of low-maintenance indoor plants for all indoor spaces and urban gardens!",
    "Jade Plant: Known to be one of the best Feng Shui plants, the coin-shaped leaves of this plant bring wealth and prosperity to its caregivers",
    "Money Plant Golden: With golden-yellow heart-shaped leaves, this plant is one of the most low-maintenance and beginner-friendly indoor Vastu plants",
    "Broken Heart Plant: With unique, memorable foliage, this plant makes for the perfect focal point in homes and also thrives in a variety of conditions",
    "Philodendron Oxycardium Green: The Oxycardium is a stunner with its multi-colored heart-shaped leaves, ease of care, and versatile growth habit",
    "Krish Self-Watering Planter: Each plant comes with our effective and efficient self-watering planter which makes sure that your plant is cared for by itself, for longer durations"
  ],
  image: [
    "/assets/products/monstra.png",
    "/assets/products/organic-plant-food.png",
    "/assets/products/self-watering.png",
    "/assets/products/snake-plant.png",
    "/assets/products/snake-plant.png",
  ],
  price: 1099,
  vendorID: "vendor-001",
  raiting: 4.5,
  reviewNumbers: 13446,
  stock: 42,
  status: "In Stock",
  discountPercent: 39,
  discountPrice: 1799,
  variants: ["prod-002", "prod-003", "prod-004"],
  variantState: true
};

// Mock variant products
const mockVariants = [
  {
    id: "prod-002",
    title: "Small",
    price: 232,
    discountPrice: 399,
    image: "/assets/products/money-plant-variant-1.jpg"
  },
  {
    id: "prod-003",
    title: "Combo of 4 Plants",
    price: 1099,
    discountPrice: 1799,
    image: "/assets/products/money-plant-variant-2.jpg"
  },
  {
    id: "prod-004",
    title: "With 4\" Ceramic Pot",
    price: 399,
    discountPrice: 699,
    image: "/assets/products/money-plant-variant-3.jpg"
  },
  {
    id: "prod-005",
    title: "GRO POT",
    price: 189,
    discountPrice: 329,
    image: "/assets/products/money-plant-variant-4.jpg"
  }
];

interface HeroSectionProps {
  productId?: string; // Optional: For fetching real data in the future
}

const HeroSection: React.FC<HeroSectionProps> = ({ productId }) => {
  const [product, setProduct] = useState<ProductDataType>(mockProduct);
  const [variants, setVariants] = useState(mockVariants);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This would be replaced with an actual API call
    if (productId) {
      // Fetch product data
      console.log("Would fetch product with ID:", productId);
    }
  }, [productId]);

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product: product.id,
      variant: selectedVariant,
      quantity
    });
    // Here you would dispatch to your cart state manager
  };

  const handleAddToWishlist = () => {
    console.log("Added to wishlist:", product.id);
    // Here you would dispatch to your wishlist state manager
  };

  const formatIndianPrice = (price: number) => {
    return price.toLocaleString('en-IN');
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

  return (
    <section className="bg-white text-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
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
                  src={product.image[selectedImage] || '/assets/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square h-16 shrink-0 overflow-hidden rounded-md border-2 ${
                      selectedImage === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img || '/assets/placeholder.jpg'}
                      alt={`${product.title} - view ${index + 1}`}
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
                    onClick={closeMagnifier}
                    className="absolute right-2 top-2 z-10 rounded-full bg-white p-1 shadow-sm"
                  >
                    <X className="size-4 text-gray-600" />
                  </button>
                  <div 
                    className="size-full" 
                    style={{
                      backgroundImage: `url(${product.image[selectedImage] || '/assets/placeholder.jpg'})`,
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
            <h1 className="mb-2 text-xl font-bold text-blue-600 sm:text-2xl">{product.title}</h1>
            {/* Vendor & Rating */}
            <div className="mb-4">
              <Link href={`/vendor/${product.vendorID}`} className="text-sm font-medium text-green-600 hover:underline">
                Visit the UGAOO Store
              </Link>
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
                <span className="text-xl font-bold text-gray-800">₹{formatIndianPrice(product.price)}</span>
                {product.discountPrice && (
                  <>
                    <span className="ml-2 text-sm text-gray-500 line-through">₹{formatIndianPrice(product.discountPrice)}</span>
                    {product.discountPercent && (
                      <span className="ml-2 text-sm font-medium text-green-600">-{product.discountPercent}%</span>
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
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`flex flex-col rounded-md border p-2 text-left transition ${
                        selectedVariant === variant.id 
                          ? 'border-green-600 bg-green-50 ring-1 ring-green-600' 
                          : 'border-gray-200 bg-white hover:border-green-600'
                      }`}
                    >
                      <span className="text-xs font-medium text-gray-600">{variant.title}</span>
                      <span className="mt-1 text-sm font-bold text-gray-800">₹{formatIndianPrice(variant.price)}</span>
                      <span className="text-xs text-gray-500 line-through">₹{formatIndianPrice(variant.discountPrice)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* About This Item */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium text-blue-600">About this item</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {product.aboutInBullets.map((bullet, index) => (
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
                <span className="text-xl font-bold text-gray-800">₹{formatIndianPrice(product.price)}</span>
                {product.discountPrice && (
                  <div className="mt-1">
                    <span className="text-sm text-gray-500 line-through">₹{formatIndianPrice(product.discountPrice)}</span>
                    {product.discountPercent && (
                      <span className="ml-2 text-sm font-medium text-green-600">Save {product.discountPercent}%</span>
                    )}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">FREE delivery <span className="font-bold text-gray-700">Tuesday, 27 May</span></p>
              </div>
              <div className="mb-4 flex items-center text-sm">
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? 'In stock' : 'Out of stock'}
                </span>
              </div>
              {/* Quantity Selector */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-600">
                  Quantity:
                </label>
                <div className="mt-1 flex items-center">
                  <button
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                    className="rounded-md p-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MinusCircle className="size-5" />
                  </button>
                  <input
                    type="text"
                    id="quantity"
                    value={quantity}
                    readOnly
                    className="w-12 border-0 bg-transparent text-center text-sm text-gray-800"
                  />
                  <button
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= product.stock}
                    className="rounded-md p-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PlusCircle className="size-5" />
                  </button>
                </div>
              </div>
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="mb-2 w-full rounded-full bg-yellow-400 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to Cart
              </button>
              {/* Buy Now Button */}
              <button
                disabled={product.stock <= 0}
                className="mb-4 w-full rounded-full bg-orange-500 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy Now
              </button>
              {/* Add to Wishlist */}
              <div className="mb-4 flex items-center">
                <input
                  id="add-gift-options"
                  type="checkbox"
                  className="size-4 rounded border-gray-300 bg-white text-green-600 focus:ring-green-500"
                />
                <label htmlFor="add-gift-options" className="ml-2 text-sm text-gray-600">
                  Add gift options
                </label>
              </div>
              <button
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
                  <span className="text-green-600 hover:underline">
                    <Link href={`/vendor/${product.vendorID}`}>
                      UGAOO Online
                    </Link>
                  </span>
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