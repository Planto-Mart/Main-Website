/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaLeaf, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Hero() {
  // Categories data
  const categories = [
    {
      id: 1,
      name: "Indoor Plants",
      image: "/assets/indoor_plants.png",
      color: "from-green-400 to-green-600"
    },
    {
      id: 2,
      name: "Garden Essentials",
      image: "/assets/outdoor_plants.png",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      id: 3,
      name: "Water Features",
      image: "/assets/green_essentials_oil.png",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 4,
      name: "Landscaping",
      image: "/assets/products/organic-plant-food.png",
      color: "from-amber-400 to-amber-600"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Handle scroll for parallax effect
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hero image container with parallax effect */}
      {/* Background for mobile */}
      <div 
  className="absolute inset-0 md:hidden"
  style={{ transform: `translateY(${scrollY * 0.2}px)` }}
>
        <Image 
    src="/assets/image.png" // mobile image
    alt="Hero mobile"
    layout="fill"
    objectFit="cover"
    className="brightness-85"
    priority
  />
      </div>
      {/* Background for desktop */}
      <div 
      className="absolute inset-0 hidden md:block"
      style={{ transform: `translateY(${scrollY * 0.2}px)` }}
    >
        <Image 
        src="/desktopIM-2.png" // desktop image
        alt="Hero desktop"
        layout="fill"
        objectFit="cover"
        className="brightness-100"
        priority
      />
      </div>
      {/* Text shadow overlay for mobile only */}
      <div className="absolute inset-0 bg-black bg-opacity-30 md:bg-opacity-0"></div>
      {/* Main content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        {/* Title and Categories Section Combined */}
        <motion.div 
          className="container mx-auto px-4 text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 50
            }}
            className="py-2 text-5xl font-bold tracking-wide drop-shadow-lg md:text-7xl lg:text-8xl"
          >
            Bring Nature Home
          </motion.h1>
          {/* Decorative leaf element with floating animation */}
          <motion.div 
            className="mb-8 flex items-center justify-center drop-shadow-md md:drop-shadow-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="h-px w-12 bg-white"></div>
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <FaLeaf className="mx-4 text-white" />
            </motion.div>
            <div className="h-px w-12 bg-white"></div>
          </motion.div>
          {/* Categories in curved layout */}
          <div className="relative">
            <motion.div 
              className="mx-auto mb-12 flex flex-wrap items-center justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categories.map((category, index) => {
                // Calculate positions for curved layout
                const isOdd = index % 2 !== 0;
                const translateY = isOdd ? 'translate-y-8 md:translate-y-12' : '';
                
                // Adjust x-position based on index
                let positionClass;
                if (index === 0) {
                  positionClass = "md:-ml-12 lg:-ml-16";
                } else if (index === categories.length - 1) {
                  positionClass = "md:-mr-12 lg:-mr-16";
                }
                
                return (
                  <motion.div
                    key={category.id}
                    className={`group mx-1 mb-4 flex transform cursor-pointer justify-center sm:mx-4 md:mx-6 ${translateY} ${positionClass || ''}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.08, transition: { duration: 0.3 } }}
                  >
                    <div className="relative size-20 overflow-hidden rounded-full shadow-lg sm:size-24 md:size-28">
                      {/* Placeholder image with color gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`}></div>
                      {/* Actual image */}
                      <Image 
                        src={category.image}
                        alt={category.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
                        <h3 className="px-1 text-center text-xs font-bold text-white drop-shadow-lg sm:px-2 sm:text-sm md:text-base">{category.name}</h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
          {/* Call to action button */}
          <div className="flex justify-center">
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 0px 8px rgba(255,255,255,0.5)"
              }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center rounded bg-green-600 px-6 py-3 font-medium text-white transition-all hover:bg-green-700 md:px-8"
            >
              Shop Now <FaMapMarkerAlt className="ml-2" />
            </motion.button>
          </div>
        </motion.div>
      </div>
      {/* SVG for nature-themed wavy bottom edge with grow-up animation */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 1.2,
          delay: 0.3,
          type: "spring",
          stiffness: 30
        }}
      >
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="h-16 w-full sm:h-20 md:h-24 lg:h-32"
        >
          {/* Forest green base layer */}
          <path 
            d="M0,120 L0,75 
               C30,65 45,85 60,70 
               C80,50 95,60 120,50 
               C150,35 180,65 210,55 
               C240,43 270,70 300,60 
               C330,48 360,70 390,60 
               C420,48 450,65 480,53 
               C510,40 540,60 570,50 
               C600,38 630,60 660,50 
               C690,38 720,65 750,55 
               C780,43 810,65 840,55 
               C870,43 900,65 930,50 
               C960,33 990,60 1020,48 
               C1050,35 1080,65 1110,55 
               C1140,43 1170,65 1200,50 
               L1200,120 Z"
            fill="white"
          />
          {/* Medium green middle layer with different pattern */}
          <path 
            d="M0,120 L0,85 
               C20,80 40,95 60,85 
               C80,75 100,90 120,80 
               C140,70 160,85 180,75 
               C200,65 220,80 240,72 
               C260,65 280,85 300,75 
               C320,65 340,85 360,75 
               C380,65 400,85 420,75 
               C440,65 460,80 480,70 
               C500,60 520,80 540,72 
               C560,65 580,85 600,75 
               C620,65 640,85 660,75 
               C680,65 700,85 720,76 
               C740,67 760,85 780,75 
               C800,65 820,80 840,70 
               C860,60 880,80 900,72 
               C920,65 940,85 960,75 
               C980,65 1000,85 1020,75 
               C1040,65 1060,80 1080,70 
               C1100,60 1120,85 1140,75 
               C1160,65 1180,85 1200,78 
               L1200,120 Z"
            fill="white"
          />
          {/* Light green top layer with subtle curves */}
          <path 
            d="M0,120 L0,95 
               C30,93 60,100 90,97 
               C120,94 150,100 180,97 
               C210,94 240,100 270,98 
               C300,96 330,100 360,98 
               C390,96 420,100 450,97 
               C480,94 510,100 540,98 
               C570,96 600,100 630,98 
               C660,96 690,100 720,97 
               C750,94 780,100 810,98 
               C840,96 870,100 900,98 
               C930,96 960,100 990,97 
               C1020,94 1050,100 1080,98 
               C1110,96 1140,100 1170,98 
               C1180,97 1190,96 1200,95 
               L1200,120 Z"
            fill="white"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default Hero;