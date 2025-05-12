/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import React, { useState, useEffect, useRef } from 'react';
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
        { name: "Monstra", image: "/assets/products/monstra.png",link:'/monstra' },
        { name: "Self-Watering Plants", image: "/assets/products/self-watering.png",link:'/self-watering' },
        { name: "Snake plant", image: "/assets/products/snake-plant.png",link:'/snake-plant' },
        { name: "Organic plant food", image: "/assets/products/organic-plant-food.png",link:'/organic-plant' }
      ]
    },
    {
      id: 2,
      title: "Revamp your home",
      subtitle: "with nature inspired decor",
      image: "/assets/products/self-watering.png",
      items: [
        { name: "Monstra", image: "/assets/products/monstra.png",link:'/monstra' },
        { name: "Self-Watering Plants", image: "/assets/products/self-watering.png",link:'/self-watering' },
        { name: "Snake plant", image: "/assets/products/snake-plant.png",link:'/snake-plant' },
        { name: "Organic plant food", image: "/assets/products/organic-plant-food.png",link:'/organic-plant' }
      ]
    },
    {
      id: 3,
      title: "Starting ₹199",
      subtitle: "PlantoMart Brands & more",
      image: "/assets/products/snake-plant.png",
      items: [
        { name: "Monstra", image: "/assets/products/monstra.png",link:'/monstra' },
        { name: "Self-Watering Plants", image: "/assets/products/self-watering.png",link:'/self-watering' },
        { name: "Snake plant", image: "/assets/products/snake-plant.png",link:'/snake-plant' },
        { name: "Organic plant food", image: "/assets/products/organic-plant-food.png",link:'/organic-plant' }
      ]
    },
    {
      id: 4,
      title: "Starting ₹149",
      subtitle: "plants",
      image: "/assets/products/organic-plant-food.png",
      items: [
        { name: "Monstra", image: "/assets/products/monstra.png",link:'/monstra' },
        { name: "Self-Watering Plants", image: "/assets/products/self-watering.png",link:'/self-watering' },
        { name: "Snake plant", image: "/assets/products/snake-plant.png",link:'/snake-plant' },
        { name: "Organic plant food", image: "/assets/products/organic-plant-food.png",link:'/organic-plant' }
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
      {/* Hero Slider Section */}
      <div 
        className="relative h-[70vh] w-full overflow-hidden md:h-[80vh]"
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
            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-2 text-4xl font-bold tracking-wide drop-shadow-lg md:text-6xl lg:text-7xl"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-6 max-w-md text-lg drop-shadow-md md:text-xl"
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
                  className="flex items-center rounded-full bg-green-600 px-6 py-3 font-medium text-white transition-all hover:bg-green-700 md:px-8"
                >
                  Shop Now <FaMapMarkerAlt className="ml-2" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-all hover:bg-opacity-50 md:size-12"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="text-xl md:text-2xl" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-all hover:bg-opacity-50 md:size-12"
          aria-label="Next slide"
        >
          <FaChevronRight className="text-xl md:text-2xl" />
        </button>
        {/* Slide Indicators */}
        <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoplay(false);
                setTimeout(() => setIsAutoplay(true), 5000);
              }}
              className={`mx-1 h-2 w-8 rounded-full transition-all ${
                currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Category Cards Section */}
      <div className="relative z-10 -mt-16 px-4 md:-mt-24 lg:-mt-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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