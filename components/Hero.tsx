import React from 'react'
import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <div>
      <section className="relative pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-12 md:mb-0 md:w-1/2">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                Bring <span className="text-green-600">Nature</span> Into Your Home
              </h1>
              <p className="mb-8 text-lg text-gray-600 md:pr-12 md:text-xl">
                Discover a curated selection of plants and eco-friendly products 
                to transform your living space into a sustainable sanctuary.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button className="flex items-center justify-center rounded-full bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700">
                  Shop Now <ArrowRight className="ml-2 size-5" />
                </button>
                <button className="rounded-full border-2 border-green-600 px-8 py-3 font-medium text-green-600 transition-colors hover:bg-green-50">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute bottom-0 right-0 -z-10 size-80 rounded-full bg-green-100"></div>
                <img 
                  src="/window.svg" 
                  alt="Plants collection" 
                  className="relative z-10 h-auto max-w-full rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
