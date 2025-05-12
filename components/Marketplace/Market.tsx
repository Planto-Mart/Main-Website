// import { useState, useEffect } from "react";
// import { Search, Filter, ChevronDown, ChevronRight, Star, ShoppingCart } from "lucide-react";

// // Mock data for demonstration
// const categories = [
//   "All Plants", "Indoor Plants", "Outdoor Plants", "Succulents", 
//   "Flowering Plants", "Air Purifying", "Low Maintenance", "Rare Plants", 
//   "Gardening Tools", "Plant Care", "Pots & Planters", "Seeds"
// ];

// const vendors = [
//   "GreenThumb", "PlantParadise", "NatureNurture", "LeafLover", 
//   "BloomingWonders", "EarthlyDelights", "ForestFinds"
// ];

// const brands = [
//   "EcoPlant", "GreenLife", "NaturalHome", "OrganicGrow", 
//   "PlantoCare", "TerraBloom", "VitalGreens"
// ];

// const priceRanges = [
//   { id: "price1", label: "Under $25", min: 0, max: 25 },
//   { id: "price2", label: "$25 - $50", min: 25, max: 50 },
//   { id: "price3", label: "$50 - $100", min: 50, max: 100 },
//   { id: "price4", label: "$100 - $200", min: 100, max: 200 },
//   { id: "price5", label: "$200 & Above", min: 200, max: 10000 }
// ];

// const sampleProducts = [
//   {
//     id: 1,
//     name: "Monstera Deliciosa",
//     image: "/api/placeholder/200/200",
//     price: 45.99,
//     discountPercentage: 15,
//     rating: 4.5,
//     vendor: "GreenThumb",
//     brand: "EcoPlant",
//     category: "Indoor Plants",
//     tags: ["air purifying", "low maintenance"],
//     stock: 12
//   },
//   {
//     id: 2,
//     name: "Snake Plant (Sansevieria)",
//     image: "/api/placeholder/200/200",
//     price: 29.99,
//     discountPercentage: 10,
//     rating: 4.8,
//     vendor: "PlantParadise",
//     brand: "NaturalHome",
//     category: "Indoor Plants",
//     tags: ["air purifying", "low light"],
//     stock: 25
//   },
//   {
//     id: 3,
//     name: "Fiddle Leaf Fig",
//     image: "/api/placeholder/200/200",
//     price: 75.00,
//     discountPercentage: 0,
//     rating: 4.2,
//     vendor: "LeafLover",
//     brand: "GreenLife",
//     category: "Indoor Plants",
//     tags: ["trending", "large plant"],
//     stock: 8
//   },
//   {
//     id: 4,
//     name: "Potting Soil Premium Mix",
//     image: "/api/placeholder/200/200",
//     price: 18.99,
//     discountPercentage: 20,
//     rating: 4.6,
//     vendor: "NatureNurture",
//     brand: "TerraBloom",
//     category: "Plant Care",
//     tags: ["essential", "organic"],
//     stock: 50
//   },
//   {
//     id: 5,
//     name: "Ceramic Plant Pot - Medium",
//     image: "/api/placeholder/200/200",
//     price: 32.50,
//     discountPercentage: 5,
//     rating: 4.4,
//     vendor: "EarthlyDelights",
//     brand: "PlantoCare",
//     category: "Pots & Planters",
//     tags: ["decorative", "drainage"],
//     stock: 15
//   },
//   {
//     id: 6,
//     name: "Succulent Collection (Set of 3)",
//     image: "/api/placeholder/200/200",
//     price: 24.99,
//     discountPercentage: 12,
//     rating: 4.7,
//     vendor: "BloomingWonders",
//     brand: "VitalGreens",
//     category: "Succulents",
//     tags: ["beginner friendly", "gift set"],
//     stock: 30
//   },
//   {
//     id: 7,
//     name: "Herb Garden Starter Kit",
//     image: "/api/placeholder/200/200",
//     price: 49.99,
//     discountPercentage: 8,
//     rating: 4.3,
//     vendor: "ForestFinds",
//     brand: "OrganicGrow",
//     category: "Seeds",
//     tags: ["edible", "indoor garden"],
//     stock: 20
//   },
//   {
//     id: 8,
//     name: "Pruning Shears - Professional",
//     image: "/api/placeholder/200/200",
//     price: 22.99,
//     discountPercentage: 0,
//     rating: 4.9,
//     vendor: "GreenThumb",
//     brand: "PlantoCare",
//     category: "Gardening Tools",
//     tags: ["stainless steel", "ergonomic"],
//     stock: 35
//   }
// ];

// const Marketplace = () => {
//   // State for filters and search
//   const [activeCategory, setActiveCategory] = useState("All Plants");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   // Toggle vendor selection
//   const toggleVendor = (vendor) => {
//     if (selectedVendors.includes(vendor)) {
//       setSelectedVendors(selectedVendors.filter(v => v !== vendor));
//     } else {
//       setSelectedVendors([...selectedVendors, vendor]);
//     }
//   };

//   // Toggle brand selection
//   const toggleBrand = (brand) => {
//     if (selectedBrands.includes(brand)) {
//       setSelectedBrands(selectedBrands.filter(b => b !== brand));
//     } else {
//       setSelectedBrands([...selectedBrands, brand]);
//     }
//   };

//   // Handle price range selection
//   const handlePriceRangeChange = (min, max) => {
//     setPriceRange({ min, max });
//   };

//   // Filter products based on all criteria
//   useEffect(() => {
//     let filtered = sampleProducts;
    
//     // Apply category filter
//     if (activeCategory !== "All Plants") {
//       filtered = filtered.filter(product => product.category === activeCategory);
//     }
    
//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(product => 
//         product.name.toLowerCase().includes(query) ||
//         product.category.toLowerCase().includes(query) ||
//         product.tags.some(tag => tag.toLowerCase().includes(query))
//       );
//     }
    
//     // Apply vendor filter
//     if (selectedVendors.length > 0) {
//       filtered = filtered.filter(product => selectedVendors.includes(product.vendor));
//     }
    
//     // Apply brand filter
//     if (selectedBrands.length > 0) {
//       filtered = filtered.filter(product => selectedBrands.includes(product.brand));
//     }
    
//     // Apply price filter
//     filtered = filtered.filter(product => 
//       product.price >= priceRange.min && product.price <= priceRange.max
//     );
    
//     setFilteredProducts(filtered);
//   }, [activeCategory, searchQuery, selectedVendors, selectedBrands, priceRange]);

//   // Toggle sidebar on mobile
//   const toggleMobileFilters = () => {
//     setShowMobileFilters(!showMobileFilters);
//   };

//   return (
//     <div className="flex min-h-screen flex-col bg-gray-50">
//       {/* Header with search */}
//       <header className="bg-green-800 p-4 md:px-8">
//         <div className="container mx-auto">
//           <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
//             <h1 className="text-2xl font-bold text-white">PlantO-Mart</h1>
//             <div className="relative w-full md:w-1/2 lg:w-1/3">
//               <input
//                 type="text"
//                 placeholder="Search plants, tools, accessories..."
//                 className="w-full rounded-lg px-4 py-2 pr-10 focus:outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
//             </div>
//           </div>
//         </div>
//       </header>
//       {/* Category navigation */}
//       <div className="scrollbar-hide overflow-x-auto bg-green-700">
//         <div className="container mx-auto px-4 py-2">
//           <div className="flex space-x-4">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 className={`whitespace-nowrap rounded-full px-3 py-1 text-sm transition ${
//                   activeCategory === category
//                     ? "bg-white font-medium text-green-800"
//                     : "text-white hover:bg-green-600"
//                 }`}
//                 onClick={() => setActiveCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="container mx-auto flex flex-col gap-6 px-4 py-6 md:flex-row">
//         {/* Mobile filter button */}
//         <button
//           className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-green-700 py-2 text-white md:hidden"
//           onClick={toggleMobileFilters}
//         >
//           <Filter size={18} />
//           <span>Filter Products</span>
//           {showMobileFilters ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
//         </button>
//         {/* Left sidebar for filters */}
//         <aside className={`w-full shrink-0 rounded-lg bg-white p-4 shadow-sm transition-all duration-300 md:w-64 ${
//           showMobileFilters ? "max-h-screen" : "max-h-0 overflow-hidden md:max-h-screen md:overflow-visible"
//         }`}>
//           <div className="space-y-6">
//             {/* Vendors */}
//             <div>
//               <h3 className="mb-2 text-lg font-semibold text-green-800">Vendors</h3>
//               <div className="space-y-1">
//                 {vendors.map((vendor) => (
//                   <div key={vendor} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id={`vendor-${vendor}`}
//                       className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//                       checked={selectedVendors.includes(vendor)}
//                       onChange={() => toggleVendor(vendor)}
//                     />
//                     <label htmlFor={`vendor-${vendor}`} className="ml-2 text-sm text-gray-700">
//                       {vendor}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {/* Brands */}
//             <div>
//               <h3 className="mb-2 text-lg font-semibold text-green-800">Brands</h3>
//               <div className="space-y-1">
//                 {brands.map((brand) => (
//                   <div key={brand} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id={`brand-${brand}`}
//                       className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//                       checked={selectedBrands.includes(brand)}
//                       onChange={() => toggleBrand(brand)}
//                     />
//                     <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
//                       {brand}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {/* Price Range */}
//             <div>
//               <h3 className="mb-2 text-lg font-semibold text-green-800">Price Range</h3>
//               <div className="space-y-1">
//                 {priceRanges.map((range) => (
//                   <div key={range.id} className="flex items-center">
//                     <input
//                       type="radio"
//                       id={range.id}
//                       name="price-range"
//                       className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
//                       onChange={() => handlePriceRangeChange(range.min, range.max)}
//                       checked={priceRange.min === range.min && priceRange.max === range.max}
//                     />
//                     <label htmlFor={range.id} className="ml-2 text-sm text-gray-700">
//                       {range.label}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {/* Clear filters button */}
//             <button
//               className="w-full rounded-lg bg-gray-100 py-2 text-green-800 transition hover:bg-gray-200"
//               onClick={() => {
//                 setSelectedVendors([]);
//                 setSelectedBrands([]);
//                 setPriceRange({ min: 0, max: 10000 });
//               }}
//             >
//               Clear All Filters
//             </button>
//           </div>
//         </aside>
//         {/* Main content - Product grid */}
//         <main className="grow">
//           {/* Results summary */}
//           <div className="mb-6 flex items-center justify-between">
//             <p className="text-gray-600">
//               Showing <span className="font-medium">{filteredProducts.length}</span> products
//             </p>
//             <div className="flex items-center gap-2">
//               <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
//               <select
//                 id="sort"
//                 className="rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
//               >
//                 <option>Featured</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Customer Rating</option>
//                 <option>Newest First</option>
//               </select>
//             </div>
//           </div>
//           {/* Product grid */}
//           {filteredProducts.length > 0 ? (
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {filteredProducts.map((product) => (
//                 <div key={product.id} className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md">
//                   <div className="relative h-48 bg-gray-100">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="size-full object-contain p-4"
//                     />
//                     {product.discountPercentage > 0 && (
//                       <div className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
//                         {product.discountPercentage}% OFF
//                       </div>
//                     )}
//                     <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
//                       <button className="flex w-full items-center justify-center gap-1 rounded-lg bg-green-600 py-1.5 text-sm font-medium text-white">
//                         <ShoppingCart size={16} />
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <div className="mb-1 text-xs text-gray-500">{product.vendor}</div>
//                     <h3 className="mb-1 font-medium text-gray-800">{product.name}</h3>
//                     <div className="mb-2 flex items-center">
//                       <div className="flex text-yellow-400">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             size={14}
//                             fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
//                             stroke={i < Math.floor(product.rating) ? "none" : "currentColor"}
//                           />
//                         ))}
//                       </div>
//                       <span className="ml-1 text-xs text-gray-500">{product.rating}</span>
//                     </div>
//                     <div className="flex items-baseline gap-2">
//                       {product.discountPercentage > 0 ? (
//                         <>
//                           <span className="font-bold text-green-700">
//                             ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
//                           </span>
//                           <span className="text-sm text-gray-500 line-through">
//                             ${product.price.toFixed(2)}
//                           </span>
//                         </>
//                       ) : (
//                         <span className="font-bold text-green-700">${product.price.toFixed(2)}</span>
//                       )}
//                     </div>
//                     {product.stock <= 10 && (
//                       <div className="mt-1 text-xs text-red-600">
//                         Only {product.stock} left in stock
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="py-12 text-center">
//               <div className="mb-4 text-5xl">🌵</div>
//               <h3 className="mb-2 text-xl font-medium text-gray-800">No products found</h3>
//               <p className="text-gray-600">Try adjusting your filters or search term</p>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Marketplace;