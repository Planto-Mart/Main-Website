// Update the import statement
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp, FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

// ... rest of the imports and data remain the same

const Marketplace = () => {
  // ... existing state and functions remain the same

  // ... in the JSX where the price range slider is used, replace the Slider component with RangeSlider:

  // In the mobile filters section:
  {expandedSections.price && (
    <div className="mt-4 px-2">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">{formatPrice(priceRange[0])}</span>
        <span className="text-sm text-gray-600">{formatPrice(priceRange[1])}</span>
      </div>
      <RangeSlider
        min={0}
        max={2000}
        step={100}
        value={priceRange}
        onInput={setPriceRange}
        className="h-2 bg-gray-200 rounded-full"
      />
    </div>
  )}

  // And in the desktop filters section:
  {expandedSections.price && (
    <div className="mt-4 px-2">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">{formatPrice(priceRange[0])}</span>
        <span className="text-sm text-gray-600">{formatPrice(priceRange[1])}</span>
      </div>
      <RangeSlider
        min={0}
        max={2000}
        step={100}
        value={priceRange}
        onInput={setPriceRange}
        className="h-2 bg-gray-200 rounded-full"
      />
    </div>
  )}

  // ... rest of the component remains the same
}

export default Marketplace;