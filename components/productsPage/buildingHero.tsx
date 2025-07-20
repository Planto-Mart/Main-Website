// /* eslint-disable no-unused-vars */
// "use client";

// import  { useState, useEffect, useRef, useId } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Star, X, Search, ShieldCheck, Heart, MinusCircle, PlusCircle } from 'lucide-react';

// import { supabase } from '@/utils/supabase/client';
// import type ProductDataType from '@/types/ProductData';
// import  products_sample  from '@/data/sampleProducts';

// interface HeroSectionProps {
//   slug: string; // Changed from productId to slug since we'll use slug for routing
// }

// const HeroSection: React.FC<HeroSectionProps> = ({ slug }) => {
//   const [product, setProduct] = useState<ProductDataType | null>(null);
//   const [variants, setVariants] = useState<ProductDataType[]>([]);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
//   const [showMagnifier, setShowMagnifier] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const imageRef = useRef<HTMLDivElement>(null);

//   const element_unique_id = useId();

//   // Function to fetch product data from local TypeScript file
//   const fetchProductFromJSON = async () => {
//     try {
//       // Import the products directly from the TypeScript file
//       const data = products_sample;
//       const foundProduct = data.find((p: ProductDataType) => p.slug === slug);
      
//       if (foundProduct) {
//         setProduct(foundProduct);
//         // If product has variants, fetch them
//         if (foundProduct.variants && foundProduct.variants.length > 0) {
//           const variantProducts = data.filter((p: ProductDataType) => 
//             foundProduct.variants?.includes(p.product_id)
//           );
//           setVariants(variantProducts);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching product:', error);
//     }
//   };

//   // Function to fetch product data from Supabase
//   const _fetchProductFromSupabase = async () => {
//     try {
//       // Fetch main product
//       const { data: productData, error: productError } = await supabase
//         .from('products_dev')
//         .select('*')
//         .eq('slug', slug)
//         .single();

//       if (productError) throw productError;
//       if (productData) {
//         setProduct(productData);
        
//         // If product has variants, fetch them
//         if (productData.variants && productData.variants.length > 0) {
//           const { data: variantData, error: variantError } = await supabase
//             .from('products_dev')
//             .select('*')
//             .in('product_id', productData.variants);

//           if (variantError) throw variantError;
//           if (variantData) {
//             setVariants(variantData);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching product from Supabase:', error);
//     }
//   };

//   // biome-ignore lint/correctness/useExhaustiveDependencies: will look into during refactor
//   useEffect(() => {
//     if (slug) {
//       // Use this for development with local JSON data
//       fetchProductFromJSON();
      
//       // Comment out the above line and uncomment below line when ready to use Supabase
//       // fetchProductFromSupabase();
//     }
//   }, [slug]);

//   const handleQuantityChange = (increment: boolean) => {
//     if (!product) return;
    
//     if (increment && quantity < product.quantity) {
//       setQuantity(quantity + 1);
//     } else if (!increment && quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   const handleVariantSelect = (variantId: string) => {
//     setSelectedVariant(variantId);
//     // Find and set the selected variant as the current product
//     const selectedVariantProduct = variants.find(v => v.product_id === variantId);
//     if (selectedVariantProduct) {
//       setProduct(selectedVariantProduct);
//       setSelectedImage(0); // Reset selected image when variant changes
//       setQuantity(1); // Reset quantity when variant changes
//     }
//   };

//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<Star key={`star-${i}`} className="size-4 fill-yellow-500 text-yellow-500" />);
//     }

//     if (hasHalfStar) {
//       stars.push(
//         <div key="half-star" className="relative">
//           <Star className="size-4 fill-gray-300 text-gray-300" />
//           <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
//             <Star className="size-4 fill-yellow-500 text-yellow-500" />
//           </div>
//         </div>
//       );
//     }

//     const emptyStars = 5 - stars.length;
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<Star key={`empty-star-${i}`} className="size-4 fill-gray-300 text-gray-300" />);
//     }

//     return stars;
//   };

//   const handleMouseEnter = () => {
//     setShowMagnifier(true);
//   };

//   const handleMouseLeave = () => {
//     setShowMagnifier(false);
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (imageRef.current) {
//       const { left, top, width, height } = imageRef.current.getBoundingClientRect();
//       const x = ((e.clientX - left) / width) * 100;
//       const y = ((e.clientY - top) / height) * 100;
//       setMousePosition({ x, y });
//     }
//   };

//   const closeMagnifier = () => {
//     setShowMagnifier(false);
//   };

//   const handleAddToCart = () => {
//     if (!product) return;
    
//     // Implement your cart logic here
//     console.log("Added to cart:", {
//       product: product.product_id,
//       variant: selectedVariant,
//       quantity
//     });
//   };

//   const handleAddToWishlist = () => {
//     if (!product) return;
    
//     // Implement your wishlist logic here
//     console.log("Added to wishlist:", product.product_id);
//   };

//   const formatIndianPrice = (price: number) => {
//     return price.toLocaleString('en-IN');
//   };

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <section className="bg-white text-gray-800">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
//           {/* Left Column - Image Gallery */}
//           <div className="lg:col-span-4">
//             <div className="sticky top-24">
//               {/** biome-ignore lint/a11y/noStaticElementInteractions: static can sometimes be dynamic even */}
//               <div 
//                 ref={imageRef}
//                 className="relative mb-4 aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//                 onMouseMove={handleMouseMove}
//               >
//                 <div className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1 shadow-sm">
//                   <Search className="size-5 text-gray-500" />
//                 </div>
//                 <Image
//                   src={product.image_gallery[selectedImage] || '/assets/placeholder.jpg'}
//                   alt={product.title}
//                   fill
//                   className="object-cover"
//                   priority
//                 />
//               </div>
//               <div className="flex space-x-2 overflow-x-auto pb-2">
//                 {product.image_gallery.map((img, index) => (
//                   <button
//                    type='button'
//                     // biome-ignore lint/suspicious/noArrayIndexKey: not needed here it seems 
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`relative aspect-square h-16 shrink-0 overflow-hidden rounded-md border-2 ${
//                       selectedImage === index ? 'border-green-600' : 'border-gray-200'
//                     }`}
//                   >
//                     <Image
//                       src={img || '/assets/placeholder.jpg'}
//                       alt={`${product.title} - view ${index + 1}`}
//                       fill
//                       className="object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//               {/* Image Magnifier Modal */}
//               {showMagnifier && (
//                 <div className="fixed left-1/2 top-1/2 z-[9999] size-[350px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border-2 border-green-500 bg-white shadow-xl">
//                   <button 
//                     type='button'
//                     onClick={closeMagnifier}
//                     className="absolute right-2 top-2 z-10 rounded-full bg-white p-1 shadow-sm"
//                   >
//                     <X className="size-4 text-gray-600" />
//                   </button>
//                   <div 
//                     className="size-full" 
//                     style={{
//                       backgroundImage: `url(${product.image_gallery[selectedImage] || '/assets/placeholder.jpg'})`,
//                       backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
//                       backgroundSize: '250%',
//                       backgroundRepeat: 'no-repeat'
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Middle Column - Product Details */}
//           <div className="lg:col-span-5">
//             <h1 className="mb-2 text-xl font-bold text-blue-600 sm:text-2xl">{product.title}</h1>
//             {/* Vendor & Rating */}
//             <div className="mb-4">
//               <Link href={`/vendor/${product.vendorID}`} className="text-sm font-medium text-green-600 hover:underline">
//                 Visit the {product.brand} Store
//               </Link>
//               <div className="mt-1 flex items-center">
//                 <div className="flex items-center">
//                   {renderStars(product.raiting)}
//                   <span className="ml-1 text-sm text-gray-600">{product.raiting}/5</span>
//                 </div>
//                 <span className="mx-2 text-gray-400">|</span>
//                 <span className="text-sm text-gray-600">{product.reviewNumbers.toLocaleString()} ratings</span>
//               </div>
//             </div>
//             {/* Price */}
//             <div className="mb-4 border-b border-gray-200 pb-4">
//               <div className="flex items-baseline">
//                 <span className="text-xl font-bold text-gray-800">₹{formatIndianPrice(product.price)}</span>
//                 {product.discountPrice && (
//                   <>
//                     <span className="ml-2 text-sm text-gray-500 line-through">₹{formatIndianPrice(product.discountPrice)}</span>
//                     {product.discountPercent && (
//                       <span className="ml-2 text-sm font-medium text-green-600">-{product.discountPercent}%</span>
//                     )}
//                   </>
//                 )}
//               </div>
//               <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>
//             </div>
//             {/* Variants */}
//             {product.variantState && variants.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="mb-2 text-sm font-medium text-gray-600">Style Name:</h3>
//                 <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                   {variants.map((variant) => (
//                     <button
//                       type='button'
//                       key={variant.product_id}
//                       onClick={() => handleVariantSelect(variant.product_id)}
//                       className={`flex flex-col rounded-md border p-2 text-left transition ${
//                         selectedVariant === variant.product_id 
//                           ? 'border-green-600 bg-green-50 ring-1 ring-green-600' 
//                           : 'border-gray-200 bg-white hover:border-green-600'
//                       }`}
//                     >
//                       <span className="text-xs font-medium text-gray-600">{variant.title}</span>
//                       <span className="mt-1 text-sm font-bold text-gray-800">₹{formatIndianPrice(variant.price)}</span>
//                       {variant.discountPrice && (
//                         <span className="text-xs text-gray-500 line-through">₹{formatIndianPrice(variant.discountPrice)}</span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {/* About This Item */}
//             <div className="mb-6">
//               <h3 className="mb-3 text-lg font-medium text-blue-600">About this item</h3>
//               <ul className="space-y-2 text-sm text-gray-600">
//                 {product.about_in_bullets.map((bullet, index) => (
//                   // biome-ignore lint/suspicious/noArrayIndexKey: not needed here
//                     <li key={index} className="flex">
//                     <span className="mr-2 mt-1 text-green-600">•</span>
//                     <span>{bullet}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//           {/* Right Column - Buy Box */}
//           <div className="lg:col-span-3">
//             <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
//               <div className="mb-4">
//                 <span className="text-xl font-bold text-gray-800">₹{formatIndianPrice(product.price)}</span>
//                 {product.discountPrice && (
//                   <div className="mt-1">
//                     <span className="text-sm text-gray-500 line-through">₹{formatIndianPrice(product.discountPrice)}</span>
//                     {product.discountPercent && (
//                       <span className="ml-2 text-sm font-medium text-green-600">Save {product.discountPercent}%</span>
//                     )}
//                   </div>
//                 )}
//                 <p className="mt-1 text-xs text-gray-500">FREE delivery <span className="font-bold text-gray-700">Tuesday, 27 May</span></p>
//               </div>
//               <div className="mb-4 flex items-center text-sm">
//                 <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   {product.quantity > 0 ? 'In stock' : 'Out of stock'}
//                 </span>
//               </div>
//               {/* Quantity Selector */}
//               <div className="mb-4">
//                 <label htmlFor="quantity" className="block text-sm font-medium text-gray-600">
//                   Quantity:
//                 </label>
//                 <div className="mt-1 flex items-center">
//                   <button
//                     type='button'
//                     onClick={() => handleQuantityChange(false)}
//                     disabled={quantity <= 1}
//                     className="rounded-md p-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     <MinusCircle className="size-5" />
//                   </button>
//                   <input
//                     type="text"
//                     id={element_unique_id}
//                     value={quantity}
//                     readOnly
//                     className="w-12 border-0 bg-transparent text-center text-sm text-gray-800"
//                   />
//                   <button
//                     type='button'
//                     onClick={() => handleQuantityChange(true)}
//                     disabled={quantity >= product.quantity}
//                     className="rounded-md p-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     <PlusCircle className="size-5" />
//                   </button>
//                 </div>
//               </div>
//               {/* Add to Cart Button */}
//               <button
//                 type='button'
//                 onClick={handleAddToCart}
//                 disabled={product.quantity <= 0}
//                 className="mb-2 w-full rounded-full bg-yellow-400 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Add to Cart
//               </button>
//               {/* Buy Now Button */}
//               <button
//                 type='button'
//                 disabled={product.quantity <= 0}
//                 className="mb-4 w-full rounded-full bg-orange-500 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Buy Now
//               </button>
//               {/* Add to Wishlist */}
//               <div className="mb-4 flex items-center">
//                 <input
//                   id={element_unique_id}
//                   type="checkbox"
//                   className="size-4 rounded border-gray-300 bg-white text-green-600 focus:ring-green-500"
//                 />
//                 <label htmlFor="add-gift-options" className="ml-2 text-sm text-gray-600">
//                   Add gift options
//                 </label>
//               </div>
//               <button
//                 type='button'
//                 onClick={handleAddToWishlist}
//                 className="mb-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
//               >
//                 <Heart className="mr-2 size-4" />
//                 Add to Wish List
//               </button>
//               {/* Secure Transaction */}
//               <div className="flex items-center text-xs text-gray-500">
//                 <ShieldCheck className="mr-1 size-4" />
//                 <span>Secure transaction</span>
//               </div>
//               {/* Shipping Info */}
//               <div className="mt-4 space-y-2 text-xs">
//                 <div className="flex">
//                   <span className="w-20 font-medium text-gray-500">Ships from</span>
//                   <span className="text-gray-700">PlantoMart</span>
//                 </div>
//                 <div className="flex">
//                   <span className="w-20 font-medium text-gray-500">Sold by</span>
//                   <span className="text-green-600 hover:underline">
//                     <Link href={`/vendor/${product.vendorID}`}>
//                       {product.brand}
//                     </Link>
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;