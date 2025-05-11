/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import React from 'react';
import Image from 'next/image';
import { FaLeaf, FaMapMarkerAlt } from 'react-icons/fa';

function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hero image container with height increased only on desktop */}
      <div className="absolute inset-0 bg-gray-900 md:h-[120vh]">
        <Image 
          src="/assets/image.png"
          alt="Camping in nature"
          layout="fill"
          objectFit="cover"
          className="brightness-85 md:brightness-100" // Brighten image on mobile
          priority
        />
      </div>
      {/* Text shadow overlay for mobile only */}
      <div className="absolute inset-0 bg-black bg-opacity-30 md:bg-opacity-0"></div>
      {/* Overlay content - centered on mobile, right-aligned on desktop */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white md:items-end md:pr-16 md:text-right lg:pr-24">
        <div className="mb-4 flex flex-col items-center md:items-end">
          {/* Mobile text has text-shadow for better visibility */}
          <p className="mb-2 text-2xl font-medium tracking-widest drop-shadow-md md:drop-shadow-none">Bring</p>
          <h1 className="mb-6 text-6xl font-bold tracking-wide drop-shadow-lg md:text-7xl md:drop-shadow-none lg:text-8xl">
            Nature
          </h1>
          <p className="mb-6 text-lg drop-shadow-md md:text-xl md:drop-shadow-none lg:text-2xl">
            Into your Home
          </p>
          {/* Decorative leaf element using react-icons */}
          <div className="mb-8 flex items-center drop-shadow-md md:drop-shadow-none">
            <div className="h-px w-12 bg-white"></div>
            <FaLeaf className="mx-4 text-white" />
            <div className="h-px w-12 bg-white"></div>
          </div>
          <p className="drop-shadow-md md:drop-shadow-none">
            Green Space Upgrades
          </p>
          <button className="mt-4 flex items-center rounded bg-green-600 px-8 py-3 font-medium text-white transition-all hover:bg-green-700">
            Shop Now <FaMapMarkerAlt className="ml-2" />
          </button>
        </div>
      </div>
      {/* SVG for nature-themed jagged bottom edge */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="h-24 w-full md:h-32"
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
      </div>
    </div>
  );
}

export default Hero;