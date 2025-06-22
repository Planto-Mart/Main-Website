/** biome-ignore-all lint/a11y/useButtonType: will refactor these later */
"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp, FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import RangeSlider from 'react-range-slider-input';

import 'react-range-slider-input/dist/style.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Sample data for marketplace
const categories = [
  "All", "Indoor Plants", "Outdoor Plants", "Succulents", "Flowering Plants", 
  "Medicinal Plants", "Fruit Plants", "Vegetable Plants", "Plant Care", "Pots & Planters"
];

const vendors = [
  { id: 1, name: "Green Thumb Nursery", products: 120 },
  { id: 2, name: "Bageecha Gardens", products: 85 },
  { id: 3, name: "Leaf & Petal Co.", products: 64 },
  { id: 4, name: "Urban Jungle", products: 52 },
  { id: 5, name: "Plantify", products: 48 },
  { id: 6, name: "Nature's Basket", products: 37 }
];

const brands = [
  { id: 1, name: "EcoGrow", products: 45 },
  { id: 2, name: "PlantLife", products: 38 },
  { id: 3, name: "GardenEssentials", products: 32 },
  { id: 4, name: "TerraCotta", products: 28 },
  { id: 5, name: "BotaniCare", products: 25 }
];

const discounts = [
  { id: 1, label: "10% or more", value: 10 },
  { id: 2, label: "20% or more", value: 20 },
  { id: 3, label: "30% or more", value: 30 },
  { id: 4, label: "40% or more", value: 40 },
  { id: 5, label: "50% or more", value: 50 }
];

const products = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    description: "The Swiss Cheese Plant, known for its unique leaf holes and splits",
    price: 1299,
    salePrice: 999,
    discount: 23,
    rating: 4.8,
    reviews: 124,
    image: "/assets/products/monstra.png",
    vendor: "Green Thumb Nursery",
    brand: "PlantLife",
    category: "Indoor Plants",
    tags: ["Air Purifying", "Low Maintenance"],
    stock: 15,
    featured: true
  },
  {
    id: 2,
    name: "Snake Plant (Sansevieria)",
    description: "Architectural, drought-tolerant houseplant with stiff, upright leaves",
    price: 749,
    salePrice: 649,
    discount: 13,
    rating: 4.9,
    reviews: 98,
    image: "/assets/products/snake-plant.png",
    vendor: "Bageecha Gardens",
    brand: "EcoGrow",
    category: "Indoor Plants",
    tags: ["Air Purifying", "Low Light"],
    stock: 22,
    featured: true
  },
  {
    id: 3,
    name: "Self-Watering Ceramic Pot",
    description: "Modern ceramic pot with self-watering system, perfect for busy plant parents",
    price: 899,
    salePrice: 799,
    discount: 11,
    rating: 4.7,
    reviews: 56,
    image: "/assets/products/self-watering.png",
    vendor: "TerraCotta",
    brand: "TerraCotta",
    category: "Pots & Planters",
    tags: ["Self-Watering", "Modern"],
    stock: 8,
    featured: false
  },
  {
    id: 4,
    name: "Organic Plant Food",
    description: "All-natural, organic fertilizer for healthy and vibrant plants",
    price: 499,
    salePrice: 399,
    discount: 20,
    rating: 4.6,
    reviews: 42,
    image: "/assets/products/organic-plant-food.png",
    vendor: "Nature's Basket",
    brand: "BotaniCare",
    category: "Plant Care",
    tags: ["Organic", "All-Purpose"],
    stock: 30,
    featured: false
  },
  {
    id: 5,
    name: "Fiddle Leaf Fig",
    description: "Popular houseplant with large, violin-shaped leaves",
    price: 1499,
    salePrice: 1299,
    discount: 13,
    rating: 4.5,
    reviews: 78,
    image: "/assets/products/fiddle-leaf.png",
    vendor: "Urban Jungle",
    brand: "PlantLife",
    category: "Indoor Plants",
    tags: ["Trending", "Statement Plant"],
    stock: 5,
    featured: true
  },
  {
    id: 6,
    name: "Herb Garden Starter Kit",
    description: "Everything you need to start your own indoor herb garden",
    price: 899,
    salePrice: 699,
    discount: 22,
    rating: 4.7,
    reviews: 63,
    image: "/assets/products/herb-kit.png",
    vendor: "Plantify",
    brand: "GardenEssentials",
    category: "Vegetable Plants",
    tags: ["Herbs", "Starter Kit"],
    stock: 12,
    featured: false
  },
  {
    id: 7,
    name: "Potting Soil Mix - 5kg",
    description: "Premium potting mix for indoor and outdoor plants",
    price: 399,
    salePrice: 349,
    discount: 13,
    rating: 4.8,
    reviews: 92,
    image: "/assets/products/potting-soil.png",
    vendor: "Nature's Basket",
    brand: "EcoGrow",
    category: "Plant Care",
    tags: ["Essential", "All-Purpose"],
    stock: 40,
    featured: false
  },
  {
    id: 8,
    name: "Peace Lily",
    description: "Elegant flowering plant that thrives in low light conditions",
    price: 899,
    salePrice: 799,
    discount: 11,
    rating: 4.6,
    reviews: 47,
    image: "/assets/products/peace-lily.png",
    vendor: "Green Thumb Nursery",
    brand: "PlantLife",
    category: "Flowering Plants",
    tags: ["Air Purifying", "Low Light"],
    stock: 18,
    featured: true
  }
];

const Marketplace = () => {
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Accordion state for filter sections
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    vendors: true,
    brands: true,
    price: true,
    discount: true
  });

  // Toggle accordion sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle vendor selection
  const handleVendorChange = (vendorId: number) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  // Handle brand selection
  const handleBrandChange = (brandId: number) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Handle discount selection
  const handleDiscountChange = (discountId: number) => {
    setSelectedDiscounts(prev => 
      prev.includes(discountId) 
        ? prev.filter(id => id !== discountId)
        : [...prev, discountId]
    );
  };

  // Apply filters
  useEffect(() => {
    let result = products;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.vendor.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    result = result.filter(product => {
      const price = product.salePrice || product.price;
      
return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Filter by vendors
    if (selectedVendors.length > 0) {
      const vendorNames = selectedVendors.map(id => 
        vendors.find(v => v.id === id)?.name
      );
      result = result.filter(product => 
        vendorNames.includes(product.vendor)
      );
    }
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      const brandNames = selectedBrands.map(id => 
        brands.find(b => b.id === id)?.name
      );
      result = result.filter(product => 
        brandNames.includes(product.brand)
      );
    }
    
    // Filter by discount
    if (selectedDiscounts.length > 0) {
      const minDiscounts = selectedDiscounts.map(id => 
        discounts.find(d => d.id === id)?.value
      );
      const minDiscount = Math.min(...minDiscounts.filter(d => d !== undefined) as number[]);
      result = result.filter(product => product.discount >= minDiscount);
    }
    
    // Sort products
    switch (sortBy) {
      case "price-low-high":
        result = [...result].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-high-low":
        result = [...result].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "newest":
        result = [...result].sort((a, b) => b.id - a.id);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      // case "featured":
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, priceRange, selectedVendors, selectedBrands, selectedDiscounts, sortBy]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriceRange([0, 2000]);
    setSelectedVendors([]);
    setSelectedBrands([]);
    setSelectedDiscounts([]);
    setSortBy("featured");
  };

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen overflow-x-hidden bg-gray-50">
        {/* Top category navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="hide-scrollbar flex items-center space-x-4 overflow-x-auto pb-2">
              {categories.map((category, index) => (
                <button
                type='button'
                // biome-ignore lint/suspicious/noArrayIndexKey: will refactor this later
                key={index}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
            >
                  {category}
                </button>
            ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Mobile filter button */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
              <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white"
            >
                <FiFilter className="mr-2" />
                Filters
              </button>
            </div>
            {/* Mobile filters sidebar */}
            <AnimatePresence>
              {mobileFiltersOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="fixed inset-0 z-50 lg:hidden"
            >
                {/** biome-ignore lint/a11y/noStaticElementInteractions: will see this later */}
                {/** biome-ignore lint/a11y/noStaticElementInteractions: will see this later */}
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileFiltersOpen(false)}></div>
                <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-2">
                      <FiX className="text-gray-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    {/* Mobile filters content - same as desktop but styled for mobile */}
                    <div className="space-y-6">
                      {/* Search */}
                      <div className="relative">
                        <input
                        type="text"
                        placeholder="Search plants, pots, and more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-green-500"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      {/* Categories */}
                      <div className="border-b pb-4">
                        <button
                        className="flex w-full items-center justify-between py-2 font-medium"
                        onClick={() => toggleSection('categories')}
                        >
                          <span>Categories</span>
                          {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedSections.categories && (
                        <div className="mt-2 space-y-2">
                            {categories.map((category, index) => (
                              // biome-ignore lint/suspicious/noArrayIndexKey: <=>
                              <div key={index} className="flex items-center">
                                <input
                                type="radio"
                                id={`mobile-category-${index}`}
                                name="mobile-category"
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(category)}
                                className="size-4 text-green-600 focus:ring-green-500"
                                />
                                <label htmlFor={`mobile-category-${index}`} className="ml-2 text-sm text-gray-700">
                                  {category}
                                </label>
                              </div>
                            ))}
                        </div>
                        )}
                      </div>
                      {/* Price Range */}
                      <div className="border-b pb-4">
                        <button
                        className="flex w-full items-center justify-between py-2 font-medium"
                        onClick={() => toggleSection('price')}
                        >
                          <span>Price Range</span>
                          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedSections.price && (
                        <div className="mt-4 px-2">
                          <div className="mb-2 flex justify-between">
                            <span className="text-sm text-gray-600">{formatPrice(priceRange[0])}</span>
                            <span className="text-sm text-gray-600">{formatPrice(priceRange[1])}</span>
                          </div>
                          <RangeSlider
                            min={0}
                            max={2000}
                            step={100}
                            value={priceRange}
                            onInput={setPriceRange}
                            className="range-slider"
                            />
                        </div>
                        )}
                      </div>
                      {/* Vendors */}
                      <div className="border-b pb-4">
                        <button
                        className="flex w-full items-center justify-between py-2 font-medium"
                        onClick={() => toggleSection('vendors')}
                        >
                          <span>Vendors</span>
                          {expandedSections.vendors ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedSections.vendors && (
                        <div className="mt-2 space-y-2">
                            {vendors.map((vendor) => (
                              <div key={vendor.id} className="flex items-center">
                                <input
                                type="checkbox"
                                id={`mobile-vendor-${vendor.id}`}
                                checked={selectedVendors.includes(vendor.id)}
                                onChange={() => handleVendorChange(vendor.id)}
                                className="size-4 text-green-600 focus:ring-green-500"
                                />
                                <label htmlFor={`mobile-vendor-${vendor.id}`} className="ml-2 text-sm text-gray-700">
                                  {vendor.name} <span className="text-xs text-gray-500">({vendor.products})</span>
                                </label>
                              </div>
                            ))}
                        </div>
                        )}
                      </div>
                      {/* Brands */}
                      <div className="border-b pb-4">
                        <button
                        className="flex w-full items-center justify-between py-2 font-medium"
                        onClick={() => toggleSection('brands')}
                        >
                          <span>Brands</span>
                          {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedSections.brands && (
                        <div className="mt-2 space-y-2">
                            {brands.map((brand) => (
                              <div key={brand.id} className="flex items-center">
                                <input
                                type="checkbox"
                                id={`mobile-brand-${brand.id}`}
                                checked={selectedBrands.includes(brand.id)}
                                onChange={() => handleBrandChange(brand.id)}
                                className="size-4 text-green-600 focus:ring-green-500"
                                />
                                <label htmlFor={`mobile-brand-${brand.id}`} className="ml-2 text-sm text-gray-700">
                                  {brand.name} <span className="text-xs text-gray-500">({brand.products})</span>
                                </label>
                              </div>
                            ))}
                        </div>
                        )}
                      </div>
                      {/* Discount */}
                      <div className="border-b pb-4">
                        <button
                        className="flex w-full items-center justify-between py-2 font-medium"
                        onClick={() => toggleSection('discount')}
                        >
                          <span>Discount</span>
                          {expandedSections.discount ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedSections.discount && (
                        <div className="mt-2 space-y-2">
                            {discounts.map((discount) => (
                              <div key={discount.id} className="flex items-center">
                                <input
                                type="checkbox"
                                id={`mobile-discount-${discount.id}`}
                                checked={selectedDiscounts.includes(discount.id)}
                                onChange={() => handleDiscountChange(discount.id)}
                                className="size-4 text-green-600 focus:ring-green-500"
                                />
                                <label htmlFor={`mobile-discount-${discount.id}`} className="ml-2 text-sm text-gray-700">
                                  {discount.label}
                                </label>
                              </div>
                            ))}
                        </div>
                        )}
                      </div>
                      {/* Reset Filters Button */}
                      <button
                        onClick={resetFilters}
                        className="w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            {/* Desktop Sidebar Filters */}
            <div className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-800">Filters</h2>
                {/* Search */}
                <div className="relative mb-6">
                  <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border text-black border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-green-500"
                />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                </div>
                {/* Categories */}
                <div className="mb-6">
                  <button
                className="flex w-full items-center justify-between text-black border-b border-gray-200 py-2 font-medium"
                onClick={() => toggleSection('categories')}
                >
                    <span>Categories</span>
                    {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections.categories && (
                  <div className="mt-3 space-y-2">
                    {categories.map((category, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: will refactor later
                      <div key={index} className="flex items-center">
                        <input
                        type="radio"
                        id={`category-${index}`}
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="size-4 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor={`category-${index}`} className="ml-2 text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                </div>
                {/* Price Range */}
                <div className="mb-6">
                  <button
                className="flex w-full items-center justify-between border-b text-black border-gray-200 py-2 font-medium"
                onClick={() => toggleSection('price')}
                >
                    <span>Price Range</span>
                    {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections.price && (
                  <div className="mt-4 px-2">
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm text-gray-600">{formatPrice(priceRange[0])}</span>
                      <span className="text-sm text-gray-600">{formatPrice(priceRange[1])}</span>
                    </div>
                    <RangeSlider
                    min={0}
                    max={2000}
                    step={100}
                    value={priceRange}
                    onInput={setPriceRange}
                    className="range-slider"
                    />
                  </div>
                )}
                </div>
                {/* Vendors */}
                <div className="mb-6">
                  <button
                className="flex w-full items-center justify-between border-b text-black border-gray-200 py-2 font-medium"
                onClick={() => toggleSection('vendors')}
                >
                    <span>Vendors</span>
                    {expandedSections.vendors ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections.vendors && (
                  <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-2">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="flex items-center">
                        <input
                        type="checkbox"
                        id={`vendor-${vendor.id}`}
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => handleVendorChange(vendor.id)}
                        className="size-4 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor={`vendor-${vendor.id}`} className="ml-2 text-sm text-gray-700">
                          {vendor.name} <span className="text-xs text-gray-500">({vendor.products})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                </div>
                {/* Brands */}
                <div className="mb-6">
                  <button
                className="flex w-full items-center justify-between border-b text-black border-gray-200 py-2 font-medium"
                onClick={() => toggleSection('brands')}
                >
                    <span>Brands</span>
                    {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections.brands && (
                  <div className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-2">
                    {brands.map((brand) => (
                      <div key={brand.id} className="flex items-center">
                        <input
                        type="checkbox"
                        id={`brand-${brand.id}`}
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandChange(brand.id)}
                        className="size-4 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor={`brand-${brand.id}`} className="ml-2 text-sm text-gray-700">
                          {brand.name} <span className="text-xs text-gray-500">({brand.products})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                </div>
                {/* Discount */}
                <div className="mb-6">
                  <button
                className="flex w-full items-center justify-between border-b text-black border-gray-200 py-2 font-medium"
                onClick={() => toggleSection('discount')}
                >
                    <span>Discount</span>
                    {expandedSections.discount ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections.discount && (
                  <div className="mt-3 space-y-2">
                    {discounts.map((discount) => (
                      <div key={discount.id} className="flex items-center">
                        <input
                        type="checkbox"
                        id={`discount-${discount.id}`}
                        checked={selectedDiscounts.includes(discount.id)}
                        onChange={() => handleDiscountChange(discount.id)}
                        className="size-4 text-green-600 focus:ring-green-500"
                        />
                        <label htmlFor={`discount-${discount.id}`} className="ml-2 text-sm text-gray-700">
                          {discount.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                </div>
                {/* Reset Filters Button */}
                <button
                onClick={resetFilters}
                className="w-full rounded-lg bg-red-700 py-2 text-white transition-colors"
            >
                  Reset Filters
                </button>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1">
              {/* Desktop title and sort */}
              <div className="mb-6 hidden items-center justify-between lg:flex">
                <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-300 text-black px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                >
                    <option value="featured">Featured</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
              {/* Results count and mobile sort */}
              <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <p className="mb-2 text-gray-600 sm:mb-0">
                  Showing <span className="font-medium">{filteredProducts.length}</span> results
                </p>
                <div className="flex items-center lg:hidden">
                  <span className="mr-2 text-sm text-gray-600">Sort by:</span>
                  <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500"
                >
                    <option value="featured">Featured</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
              {/* Product grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
                      <Link href={`/product/${product.id}`} className="relative block">
                        <div className="relative h-64 w-full bg-gray-100">
                          <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                        />
                          {product.discount > 0 && (
                          <div className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                            {product.discount}% OFF
                          </div>
                        )}
                          {product.featured && (
                          <div className="absolute right-2 top-2 rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
                            Featured
                          </div>
                        )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="mb-1 flex items-start justify-between">
                          <Link href={`/product/${product.id}`} className="block">
                            <h3 className="text-lg font-medium text-gray-800 transition-colors hover:text-green-600">
                              {product.name}
                            </h3>
                          </Link>
                          <button className="text-gray-400 transition-colors hover:text-red-500">
                            <FiHeart size={18} />
                          </button>
                        </div>
                        <p className="mb-2 text-sm text-gray-500">{product.vendor}</p>
                        <div className="mb-2 flex items-center">
                          <div className="mr-1 flex items-center text-yellow-400">
                            <FiStar className="fill-current" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.salePrice ? (
                              <div className="flex items-center">
                                <span className="mr-2 text-lg font-bold text-gray-800">
                                  {formatPrice(product.salePrice)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-800">
                            {formatPrice(product.price)}
                          </span>
                        )}
                          </div>
                          <button className="rounded-full bg-green-600 p-2 text-white transition-colors hover:bg-green-700">
                            <FiShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
                </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <h3 className="mb-2 text-xl font-medium text-gray-800">No products found</h3>
                <p className="mb-4 text-gray-600">Try adjusting your filters or search query.</p>
                <button
                onClick={resetFilters}
                className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Marketplace;