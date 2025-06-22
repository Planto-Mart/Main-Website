/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Define proper types for the items
interface CategoryItem {
  name: string;
  image: string;
  price?: string;
  subtitle?: string;
  link: string | '/';
}

interface CategoryCard {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  items: CategoryItem[];
}

function Hero() {
  // Hero slides data
  const heroSlides = [
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
  ];

  // Category cards data
  const categoryCards:CategoryCard[] = [
    {
      id: 1,
      title: "Monstra Plants",
      subtitle: "Up to 55% off",
      image: "/assets/products/monstra.png",
      items: [
        { name: "Monstra", image: "/assets/products/monstra.png",link:'/product/monstra' },
        { name: "Self-Watering Plants", image: "/assets/products/self-watering.png",link:'/product/self-watering' },
        { name: "Snake plant", image: "/assets/products/snake-plant.png",link:'/product/snake-plant' },
        { name: "Organic plant food", image: "/assets/products/organic-plant-food.png",link:'/product/organic-plant' }
      ]
    },
    {
      id: 2,
      title: "Revamp your home",
      subtitle: "with nature inspired decor",
      image: "/assets/products/self-watering.png",
      items: [
        { name: "Monstra", image: "/assets/products/monstra.png",link:'/product/monstra' },
        { name: "Self-Watering Plants", image: "/assets/products/self-watering.png",link:'/product/self-watering' },
        { name: "Snake plant", image: "/assets/products/snake-plant.png",link:'/snake-plant' },
        { name: "Organic plant food", image: "/assets/products/organic-plant-food.png",link:'/product/organic-plant' }
      ]
    },
    {
      id: 3,
      title: "Starting ₹199",
      subtitle: "PlantoMart Brands & more",
      image: "/assets/products/snake-plant.png",
      items: [
        { name: "Monstra", image: "/assets/products/monstra.png",link:'/product/monstra' },
        { name: "Self-Watering Plants", image: "/assets/products/self-watering.png",link:'/product/self-watering' },
        { name: "Snake plant", image: "/assets/products/snake-plant.png",link:'/product/snake-plant' },
        { name: "Organic plant food", image: "/assets/products/organic-plant-food.png",link:'/product/organic-plant' }
      ]
    },
    {
      id: 4,
      title: "Starting ₹149",
      subtitle: "plants",
      image: "/assets/products/organic-plant-food.png",
      items: [
        { name: "Monstra", image: "/assets/products/monstra.png",link:'/product/monstra' },
        { name: "Self-Watering Plants", image: "/assets/products/self-watering.png",link:'/product/self-watering' },
        { name: "Snake plant", image: "/assets/products/snake-plant.png",link:'/product/snake-plant' },
        { name: "Organic plant food", image: "/assets/products/organic-plant-food.png",link:'/product/organic-plant' }
      ]
    }
  ];

  // State for hero slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll for parallax effect
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero slider autoplay
  // biome-ignore lint/correctness/useExhaustiveDependencies: Will look into this while refactoring
    useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoplay, heroSlides.length]);

  // Pause autoplay on hover
  const pauseAutoplay = () => setIsAutoplay(false);
  const resumeAutoplay = () => setIsAutoplay(true);

  // Navigate to next/prev slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  return (
    <div className="relative w-full">
      {/* Hero Slider Section - reduced height on mobile */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: will look into while refactoring */}
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
            {/* Mobile Image - smaller height */}
            <div 
              className="absolute inset-0 md:hidden"
              style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            >
              <Image 
                src={slide.mobileImage}
                alt={slide.title}
                layout="fill"
                objectFit="cover"
                className="brightness-75"
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
                layout="fill"
                objectFit="cover"
                className="brightness-90"
                priority={index === 0}
              />
            </div>
            {/* Text Overlay - adjusted for mobile */}
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
        {/* Navigation Arrows - smaller on mobile */}
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
        {/* Slide Indicators - smaller on mobile */}
        <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center md:bottom-4">
          {heroSlides.map((_, index) => (
            <button
              type='button'
              // biome-ignore lint/suspicious/noArrayIndexKey: will look into while refactoring
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoplay(false);
                setTimeout(() => setIsAutoplay(true), 5000);
              }}
              className={`mx-1 h-1 w-4 rounded-full transition-all md:h-2 md:w-8 ${
                currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Category Cards Section - adjusted for mobile (moved up) */}
      <div className="relative z-10 -mt-10 px-2 sm:px-3 md:-mt-24 md:px-4 lg:-mt-32">
        <div className="container mx-auto">
          {/* Mobile Layout - 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            {categoryCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: card.id * 0.1 }}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
              >
                <div className="p-2">
                  <h3 className="text-xs font-bold text-gray-800">{card.title}</h3>
                  <p className="text-xs text-gray-600">{card.subtitle}</p>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {card.items.slice(0, 4).map((item, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: don't need it here it seems
                        <Link href={item.link} key={idx} className="group">
                        <div className="overflow-hidden rounded-md">
                          <div className="relative h-16 w-full overflow-hidden bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="mt-1">
                            <p className="truncate text-xs font-medium text-gray-800">{item.name}</p>
                            {item.price && (
                              <p className="text-xs font-medium text-green-600">{item.price}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="#" className="mt-1 block text-xs font-medium text-blue-600 hover:underline">
                    See {card.id === 3 || card.id === 4 ? 'all offers' : 'more'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Tablet Layout */}
          <div className="hidden grid-cols-2 gap-3 sm:grid lg:hidden">
            {categoryCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: card.id * 0.1 }}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
              >
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-800">{card.title}</h3>
                  <p className="text-xs text-gray-600">{card.subtitle}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {card.items.map((item, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: don't need it here it seems
                      <Link href={item.link} key={idx} className="group">
                        <div className="overflow-hidden rounded-md">
                          <div className="relative h-20 w-full overflow-hidden bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="mt-1">
                            <p className="text-xs font-medium text-gray-800">{item.name}</p>
                            {item.price && (
                              <p className="text-xs font-medium text-green-600">{item.price}</p>
                            )}
                            {item.subtitle && (
                              <p className="text-xs text-gray-500">{item.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="#" className="mt-2 block text-xs font-medium text-blue-600 hover:underline">
                    See {card.id === 3 || card.id === 4 ? 'all offers' : 'more'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Desktop Layout */}
          <div className="hidden grid-cols-4 gap-4 lg:grid">
            {categoryCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: card.id * 0.1 }}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
              >
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.subtitle}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {card.items.map((item, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: don't need it here it seems
                        <Link href={item.link} key={idx} className="group">
                        <div className="overflow-hidden rounded-md">
                          <div className="relative h-24 w-full overflow-hidden bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="mt-1">
                            <p className="text-xs font-medium text-gray-800">{item.name}</p>
                            {item.price && (
                              <p className="text-xs font-medium text-green-600">{item.price}</p>
                            )}
                            {item.subtitle && (
                              <p className="text-xs text-gray-500">{item.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="#" className="mt-4 block text-sm font-medium text-blue-600 hover:underline">
                    See {card.id === 3 || card.id === 4 ? 'all offers' : 'more'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;