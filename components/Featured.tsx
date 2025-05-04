"use client";
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';

// Define types for our products and cart/wishlist items
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  tag: string;
  numericPrice: number; // For calculations
}

// Define cart item type with quantity
interface CartItem extends Product {
  quantity: number;
}

function Featured() {
  // Sample products with unique IDs
  const products: Product[] = [
    { id: "prod-1", title: "Monstera Deliciosa", price: "₹1,299", numericPrice: 1299, image: "/assets/products/monstra.png", tag: "Bestseller" },
    { id: "prod-2", title: "Self-Watering Ceramic Pot", price: "₹899", numericPrice: 899, image: "/assets/products/self-watering.png", tag: "New" },
    { id: "prod-3", title: "Snake Plant", price: "₹749", numericPrice: 749, image: "/assets/products/snake-plant.png", tag: "Popular" },
    { id: "prod-4", title: "Organic Plant Food", price: "₹499", numericPrice: 499, image: "/assets/products/organic-plant-food.png", tag: "Eco-friendly" }
  ];

  // State for cart and wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loadingCart, setLoadingCart] = useState<string | null>(null);
  const [loadingWishlist, setLoadingWishlist] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize state from localStorage on component mount
  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('plantomartCart');
    const storedWishlist = localStorage.getItem('plantomartWishlist');
    
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart data:", e);
        localStorage.removeItem('plantomartCart');
      }
    }
    
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist data:", e);
        localStorage.removeItem('plantomartWishlist');
      }
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (isClient && cartItems.length >= 0) {
      localStorage.setItem('plantomartCart', JSON.stringify(cartItems));
      
      // Optional: Dispatch a custom event that other components can listen for
      const event = new CustomEvent('cartUpdated', { detail: cartItems });
      window.dispatchEvent(event);
    }
  }, [cartItems, isClient]);

  // Update localStorage when wishlist changes
  useEffect(() => {
    if (isClient && wishlistItems.length >= 0) {
      localStorage.setItem('plantomartWishlist', JSON.stringify(wishlistItems));
      
      // Optional: Dispatch a custom event that other components can listen for
      const event = new CustomEvent('wishlistUpdated', { detail: wishlistItems });
      window.dispatchEvent(event);
    }
  }, [wishlistItems, isClient]);

  // Check if product is in cart
  const isInCart = (productId: string): boolean => {
    return cartItems.some(item => item.id === productId);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Handle adding/removing from cart with loading state
  const toggleCart = (product: Product) => {
    setLoadingCart(product.id);
    
    // Simulate network delay for better UX feedback
    setTimeout(() => {
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          // Remove from cart
          const newItems = prevItems.filter(item => item.id !== product.id);
          // Show toast AFTER state update
          setTimeout(() => toast.success(`${product.title} removed from cart`), 0);
          
return newItems;
        } else {
          // Add to cart with quantity 1
          const newItem: CartItem = { ...product, quantity: 1 };
          const newItems = [...prevItems, newItem];
          // Show toast AFTER state update
          setTimeout(() => toast.success(`${product.title} added to cart`), 0);
          
return newItems;
        }
      });
      setLoadingCart(null);
    }, 600);
  };

  // Handle adding/removing from wishlist with loading state
  const toggleWishlist = (product: Product) => {
    setLoadingWishlist(product.id);
    
    // Simulate network delay for better UX feedback
    setTimeout(() => {
      setWishlistItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          // Remove from wishlist
          const newItems = prevItems.filter(item => item.id !== product.id);
          // Show toast AFTER state update
          setTimeout(() => toast.success(`${product.title} removed from wishlist`), 0);
          
return newItems;
        } else {
          // Add to wishlist
          const newItems = [...prevItems, product];
          // Show toast AFTER state update
          setTimeout(() => toast.success(`${product.title} added to wishlist`), 0);
          
return newItems;
        }
      });
      setLoadingWishlist(null);
    }, 400);
  };

  return (
    <div>
      {/* Add Toaster directly in the component */}
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          }
        }}
      />
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 text-center md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-4xl">Featured Products</h2>
            <p className="mx-auto max-w-3xl text-base text-gray-600 md:text-lg">
              Explore our most popular plant selections and eco-friendly essentials
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      width={500}
                      height={500} 
                      src={product.image} 
                      alt={product.title} 
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                    {product.tag}
                  </span>
                  <button 
                    className={`absolute right-4 top-4 rounded-full p-2 shadow-md transition-all duration-200 ${
                      isInWishlist(product.id) 
                        ? 'bg-red-50 hover:bg-red-100' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleWishlist(product)}
                    disabled={loadingWishlist === product.id}
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {loadingWishlist === product.id ? (
                      <Loader2 className="size-5 animate-spin text-gray-600" />
                    ) : (
                      <Heart 
                        className={`size-5 transition-colors ${
                          isInWishlist(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    )}
                  </button>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="mb-2 line-clamp-1 text-base font-bold text-gray-900 md:text-lg">{product.title}</h3>
                  <p className="mb-4 font-bold text-green-600">{product.price}</p>
                  <button 
                    className={`flex w-full items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-all duration-200 ${
                      isInCart(product.id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-green-600 hover:text-white'
                    }`}
                    onClick={() => toggleCart(product)}
                    disabled={loadingCart === product.id}
                  >
                    {loadingCart === product.id ? (
                      <Loader2 className="mr-2 size-5 animate-spin" />
                    ) : isInCart(product.id) ? (
                      <>
                        <Check className="mr-2 size-5" />
                        <span className="text-sm md:text-base">Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 size-5" />
                        <span className="text-sm md:text-base">Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center md:mt-12">
            <button className="rounded-full border-2 border-green-600 px-6 py-2.5 font-medium text-green-600 transition-colors hover:bg-green-50 md:px-8 md:py-3">
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Featured;