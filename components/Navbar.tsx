"use client";
import { useEffect, useState } from 'react';
import { ShoppingCart, User, Search } from "lucide-react";
import Image from 'next/image';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className={`fixed z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white py-2 shadow-md' : 'bg-white py-2'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <img src="/api/placeholder/50/50" alt="Plantomart Logo" className="size-12" />
              <span className="ml-2 text-xl font-bold text-green-800">plantomart</span>
            </a>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 lg:flex">
            <div className="group relative">
              <a href="#" className="flex items-center text-gray-700 hover:text-green-600">
                Vendors
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
            <a href="#" className="text-gray-700 hover:text-green-600">Menu</a>
            <a href="#" className="text-gray-700 hover:text-green-600">About</a>
            <div className="group relative">
              <a href="#" className="flex items-center text-gray-700 hover:text-green-600">
                Blog
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
            <div className="group relative">
              <a href="#" className="flex items-center text-gray-700 hover:text-green-600">
                Page
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
            <a href="#" className="text-gray-700 hover:text-green-600">Contact</a>
          </div>
          {/* Delivery Info */}
          <div className="hidden items-center lg:flex">
            <div className="mr-4 flex items-center text-green-600">
              <div className="mr-2 rounded-full bg-green-100 p-2">
                <Image width={500} height={500} src="/logo.png" alt="Delivery" className="size-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Reach Out At</span>
                <span className="font-bold text-yellow-500">+91 833 180 1000</span>
              </div>
            </div>
            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-green-600">
                <Search className="size-5" />
              </button>
              <button className="text-gray-700 hover:text-green-600">
                <User className="size-5" />
              </button>
              <div className="relative">
                <button className="text-gray-700 hover:text-green-600">
                  <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">3</span>
                  <ShoppingCart className="size-5" />
                </button>
              </div>
              <div className="relative">
                <button className="text-gray-700 hover:text-green-600">
                  <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">2</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button className="text-gray-700 hover:text-green-600">
              <Search className="size-5" />
            </button>
            <button className="text-gray-700 hover:text-green-600">
              <User className="size-5" />
            </button>
            <div className="relative">
              <button className="text-gray-700 hover:text-green-600">
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">2</span>
                <ShoppingCart className="size-5" />
              </button>
            </div>
            <button className="text-gray-700" onClick={toggleMenu}>
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="bg-white p-4 shadow-lg lg:hidden">
          <div className="flex flex-col space-y-4">
            <a href="#" className="flex items-center justify-between border-b border-gray-100 py-2 text-gray-700 hover:text-green-600">
              Vendors
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#" className="border-b border-gray-100 py-2 text-gray-700 hover:text-green-600">Menu</a>
            <a href="#" className="border-b border-gray-100 py-2 text-gray-700 hover:text-green-600">About</a>
            <a href="#" className="flex items-center justify-between border-b border-gray-100 py-2 text-gray-700 hover:text-green-600">
              Blog
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#" className="flex items-center justify-between border-b border-gray-100 py-2 text-gray-700 hover:text-green-600">
              Page
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#" className="border-b border-gray-100 py-2 text-gray-700 hover:text-green-600">Contact</a>
            {/* Mobile Delivery Info */}
            <div className="flex items-center pt-2">
              <div className="mr-2 rounded-full bg-green-100 p-2">
                <img src="/api/placeholder/24/24" alt="Delivery" className="size-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Reach Out At</span>
                <span className="font-bold text-yellow-500">+91 833 180 1000</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;