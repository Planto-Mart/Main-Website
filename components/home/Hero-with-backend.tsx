"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/config/api';
import axios from 'axios';

// Define proper types for the items
interface CategoryItem {
  id: string;
  name: string;
  image: string;
  price?: number;
  discountedPrice?: number;
  slug: string;
  link: string;
}

interface CategoryCard {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  items: CategoryItem[];
  linkText: string;
  linkHref: string;
}

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  mobileImage: string;
}

interface ApiProduct {
  product_id: string;
  title: string;
  slug: string;
  images?: string[];
  image_gallery?: string[]; // Add this line
  image?: string;
  thumbnail?: string;
  productImage?: string;
  imageUrl?: string;
  photo?: string;
  price: number;
  discountedPrice?: number;
  rating?: number;
  category?: string;
  [key: string]: any;
}

interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
  message?: string;
}

// Custom hook for API data fetching
const useCategoryData = () => {
  const [categoryCards, setCategoryCards] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformProduct = useCallback((product: ApiProduct): CategoryItem => {
  // Simplified image handling
  let imageUrl = '/assets/products/placeholder.png';
  
  // Priority order for image fields - updated to handle image_gallery properly
  const imageFields = [
    // Handle image_gallery array
    ...(Array.isArray(product.image_gallery) ? product.image_gallery : []),
    // Handle images array (existing field)
    ...(Array.isArray(product.images) ? product.images : []),
    // Single image fields
    product.image,
    product.thumbnail,
    product.productImage,
    product.imageUrl,
    product.photo
  ].filter(Boolean); // Remove null/undefined values
  
  // Find first valid image
  for (const field of imageFields) {
    if (field && typeof field === 'string' && field.trim() !== '') {
      const cleanImage = field.trim();
      
      // Handle base64 images
      if (cleanImage.startsWith('data:image/')) {
        imageUrl = cleanImage;
        break;
      }
      // Handle full URLs
      else if (cleanImage.startsWith('http') || cleanImage.startsWith('//')) {
        imageUrl = cleanImage;
        break;
      }
      // Handle relative paths (but skip placeholder)
      else if (!cleanImage.includes('placeholder') && cleanImage.length > 0) {
        imageUrl = cleanImage.startsWith('/') ? cleanImage : `/${cleanImage}`;
        break;
      }
    }
  }
  
  return {
    id: product.product_id,
    name: product.title,
    image: imageUrl,
    price: product.price,
    discountedPrice: product.discountedPrice,
    slug: product.slug,
    link: `/product/${product.slug}`
  };
}, []);

  const fetchWithFallback = useCallback(async (url: string, fallback: CategoryItem[] = []) => {
    try {
      const response = await axios.get<ApiResponse>(url);
      
      if (response.data?.success && response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data.slice(0, 4).map(transformProduct);
      }
      return fallback;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      return fallback;
    }
  }, [transformProduct]);

  const fetchCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [topRatedItems, indoorPlantsItems, startingPriceItems, discountedItems] = await Promise.all([
        fetchWithFallback(API_ENDPOINTS.getTopRatedProductsByVendor('VND-TZLWAY6W')),
        fetchWithFallback(API_ENDPOINTS.getFeaturedProductsByCategory('indoor-plants')),
        fetchWithFallback(API_ENDPOINTS.getProductsByStartingPrice(149, 1050)),
        fetchWithFallback(API_ENDPOINTS.getProductsByMinDiscount(50))
      ]);

      const cards: CategoryCard[] = [
        {
          id: 1,
          title: "Top Rated Products",
          subtitle: "From vendor VND-TZLWAY6W",
          image: "/assets/products/monstra.png",
          items: topRatedItems,
          linkText: "See more",
          linkHref: "/products/top-rated"
        },
        {
          id: 2,
          title: "Indoor Plants",
          subtitle: "Featured collection",
          image: "/assets/products/self-watering.png",
          items: indoorPlantsItems,
          linkText: "See more",
          linkHref: "/products/indoor-plants"
        },
        {
          id: 3,
          title: "Starting ₹149",
          subtitle: "PlantoMart Brands & more",
          image: "/assets/products/snake-plant.png",
          items: startingPriceItems,
          linkText: "See all offers",
          linkHref: "/products/starting-149"
        },
        {
          id: 4,
          title: "50% + Discounts",
          subtitle: "Special discount",
          image: "/assets/products/organic-plant-food.png",
          items: discountedItems,
          linkText: "See all offers",
          linkHref: "/products/discounted"
        }
      ];

      setCategoryCards(cards);
    } catch (err) {
      console.error('Error fetching category data:', err);
      setError('Failed to load category data');
      // Set fallback data structure with empty items
      setCategoryCards([
        {
          id: 1,
          title: "Top Rated Products",
          subtitle: "From vendor VND-TZLWAY6W",
          image: "/assets/products/monstra.png",
          items: [],
          linkText: "See more",
          linkHref: "/products/top-rated"
        },
        {
          id: 2,
          title: "Indoor Plants",
          subtitle: "Featured collection",
          image: "/assets/products/self-watering.png",
          items: [],
          linkText: "See more",
          linkHref: "/products/indoor-plants"
        },
        {
          id: 3,
          title: "Starting ₹149",
          subtitle: "PlantoMart Brands & more",
          image: "/assets/products/snake-plant.png",
          items: [],
          linkText: "See all offers",
          linkHref: "/products/starting-149"
        },
        {
          id: 4,
          title: "50% + Discounts",
          subtitle: "Special discount",
          image: "/assets/products/organic-plant-food.png",
          items: [],
          linkText: "See all offers",
          linkHref: "/products/discounted"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchWithFallback]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  return { categoryCards, loading, error, refetch: fetchCategoryData };
};

// Custom hook for hero slider
const useHeroSlider = (slides: HeroSlide[]) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  }, []);

  const pauseAutoplay = useCallback(() => setIsAutoplay(false), []);
  const resumeAutoplay = useCallback(() => setIsAutoplay(true), []);

  useEffect(() => {
    if (isAutoplay && slides.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoplay, slides.length]);

  return {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    pauseAutoplay,
    resumeAutoplay
  };
};

// Custom hook for scroll parallax
const useScrollParallax = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
};

// Product Item Component
const ProductItem: React.FC<{ item: CategoryItem; index: number }> = ({ item, index }) => {
  const [imgSrc, setImgSrc] = useState(item.image);
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImgError(true);
    setIsLoading(false);
    // Only fallback to placeholder if not already using it
    if (!imgSrc.includes('placeholder')) {
      setImgSrc('/assets/products/placeholder.png');
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImgError(false);
  };

  return (
    <Link href={item.link} className="group">
      <div className="overflow-hidden rounded-md">
        <div className="relative h-16 w-full overflow-hidden bg-gray-100 sm:h-20 lg:h-24">
          {/* Loading placeholder */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
            </div>
          )}
          
          {/* Error state */}
          {imgError && imgSrc.includes('placeholder') ? (
            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500 text-xs">
              No Image
            </div>
          ) : (
            <Image
              src={imgSrc}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw"
              className={`object-cover transition-all duration-300 group-hover:scale-110 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading={index < 4 ? "eager" : "lazy"}
              onError={handleImageError}
              onLoad={handleImageLoad}
              unoptimized={imgSrc.startsWith('data:') || imgSrc.startsWith('http') || imgSrc.startsWith('//')}
            />
          )}
        </div>
        <div className="mt-1">
          <p className="truncate text-xs font-medium text-gray-800 sm:text-sm" title={item.name}>
            {item.name}
          </p>
          {(item.price || item.discountedPrice) && (
            <div className="flex items-center gap-1">
              {item.discountedPrice && (
                <p className="text-xs font-medium text-green-600 sm:text-sm">
                  ₹{item.discountedPrice}
                </p>
              )}
              {item.price && (
                <p className={`text-xs sm:text-sm ${
                  item.discountedPrice 
                    ? 'text-gray-500 line-through' 
                    : 'font-medium text-green-600'
                }`}>
                  ₹{item.price}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// Category Card Component
const CategoryCard: React.FC<{ card: CategoryCard }> = ({ card }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: card.id * 0.1 }}
    className="overflow-hidden rounded-lg bg-white shadow-lg"
  >
    <div className="p-2 sm:p-3 lg:p-4">
      <h3 className="text-xs font-bold text-gray-800 sm:text-sm lg:text-lg">{card.title}</h3>
      <p className="text-xs text-gray-600 sm:text-sm">{card.subtitle}</p>
      <div className="mt-2 grid grid-cols-2 gap-1 sm:gap-2 lg:gap-3 lg:mt-3">
        {card.items.length > 0 ? (
          card.items.map((item, idx) => (
            <ProductItem key={item.id} item={item} index={idx} />
          ))
        ) : (
          // Loading placeholders
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="h-16 w-full bg-gray-200 rounded-md sm:h-20 lg:h-24" />
              <div className="mt-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))
        )}
      </div>
      <Link 
        href={card.linkHref} 
        className="mt-1 block text-xs font-medium text-blue-600 hover:underline sm:mt-2 lg:mt-4 lg:text-sm"
      >
        {card.linkText}
      </Link>
    </div>
  </motion.div>
);

function Hero() {
  // Hero slides data - memoized for performance
  const heroSlides = useMemo<HeroSlide[]>(() => [
    {
      id: 1,
      title: "Bring Nature Home",
      subtitle: "Transform your space with our premium plants",
      image: "/desktopIM-2.png",
      mobileImage: "/assets/image.png"
    },
    {
      id: 2,
      title: "Eco-Friendly Products",
      subtitle: "Sustainable solutions for your garden",
      image: "/HeroIM2.png",
      mobileImage: "/desktopIM-2.png"
    },
    {
      id: 3,
      title: "Expert Plant Care",
      subtitle: "Tips and tools for thriving gardens",
      image: "/assets/Hero_section.png",
      mobileImage: "/assets/Hero_section.png"
    }
  ], []);

  // Custom hooks
  const { categoryCards, loading, error } = useCategoryData();
  const { 
    currentSlide, 
    nextSlide, 
    prevSlide, 
    goToSlide, 
    pauseAutoplay, 
    resumeAutoplay 
  } = useHeroSlider(heroSlides);
  const scrollY = useScrollParallax();

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <p>Error loading content. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Hero Slider Section */}
      <div 
        className="relative h-[40vh] w-full overflow-hidden sm:h-[50vh] md:h-[80vh]"
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplay}
      >
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              zIndex: currentSlide === index ? 10 : 0
            }}
            transition={{ duration: 0.8 }}
          >
            {/* Mobile Image */}
            <div 
              className="absolute inset-0 md:hidden"
              style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            >
              <Image 
                src={slide.mobileImage}
                alt={slide.title}
                fill
                sizes="100vw"
                className="object-cover brightness-75"
                priority={index === 0}
              />
            </div>
            {/* Desktop Image */}
            <div 
              className="absolute inset-0 hidden md:block"
              style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            >
              <Image 
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                className="object-cover brightness-90"
                priority={index === 0}
              />
            </div>
            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-1 text-2xl font-bold tracking-wide drop-shadow-lg sm:text-3xl md:mb-2 md:text-5xl lg:text-7xl"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-4 max-w-md text-sm drop-shadow-md sm:text-base md:mb-6 md:text-xl"
              >
                {slide.subtitle}
              </motion.p>
              <Link href="/marketplace">
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 0px 8px rgba(255,255,255,0.5)"
                  }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 md:px-6 md:py-3 md:text-base lg:px-8"
                >
                  Shop Now <FaMapMarkerAlt className="ml-2" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
        
        {/* Navigation Arrows */}
        <button 
          type='button'
          onClick={prevSlide}
          className="absolute left-2 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-all hover:bg-opacity-50 sm:left-4 md:size-12"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-lg md:text-2xl" />
        </button>
        <button 
          type='button'
          onClick={nextSlide}
          className="absolute right-2 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-all hover:bg-opacity-50 sm:right-4 md:size-12"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-lg md:text-2xl" />
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center md:bottom-4">
          {heroSlides.map((_, index) => (
            <button
              type='button'
              key={index}
              onClick={() => goToSlide(index)}
              className={`mx-1 h-1 w-4 rounded-full transition-all md:h-2 md:w-8 ${
                currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Category Cards Section */}
      <div className="relative z-10 -mt-10 px-2 sm:px-3 md:-mt-24 md:px-4 lg:-mt-32">
        <div className="container mx-auto">
          {/* Mobile Layout - 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            {categoryCards.map((card) => (
              <CategoryCard key={card.id} card={card} />
            ))}
          </div>
          
          {/* Tablet Layout */}
          <div className="hidden grid-cols-2 gap-3 sm:grid lg:hidden">
            {categoryCards.map((card) => (
              <CategoryCard key={card.id} card={card} />
            ))}
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden grid-cols-4 gap-4 lg:grid">
            {categoryCards.map((card) => (
              <CategoryCard key={card.id} card={card} />
            ))}
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;