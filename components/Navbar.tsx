/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import { useEffect, useState } from 'react';
import { ShoppingCart, User, Search, Truck, Heart, X, Menu, ChevronDown, ChevronRight, Phone, Minus, Plus, LogOut } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

import { supabase } from '../utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';

import SignIn from './auth/Sign-in';

// Define types for our products and cart/wishlist items
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  tag: string;
  numericPrice: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileVendorOpen, setIsMobileVendorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Initialize state from localStorage on component mount and check auth status
  // biome-ignore lint/correctness/useExhaustiveDependencies: will reafactor later
  useEffect(() => {
    setIsClient(true);
    loadCartAndWishlist();
    checkUserSession();

    // Add event listeners for cart and wishlist updates
    window.addEventListener('cartUpdated', loadCartAndWishlist);
    window.addEventListener('wishlistUpdated', loadCartAndWishlist);
    window.addEventListener('storage', handleStorageChange);
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );
    
    return () => {
      window.removeEventListener('cartUpdated', loadCartAndWishlist);
      window.removeEventListener('wishlistUpdated', loadCartAndWishlist);
      window.removeEventListener('storage', handleStorageChange);
      subscription.unsubscribe();
    };
  }, []);

  // Check if user is already logged in
  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      fetchUserProfile(session.user.id);
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching user profile for ID:', userId);
    try {
      // Use the backend API instead of direct Supabase query
      const res = await fetch(API_ENDPOINTS.getProfileByUUID(userId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        console.error('Error fetching user profile:', res.status, res.statusText);
        // If profile doesn't exist yet, create a basic one from auth data
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url || user.identities?.[0]?.identity_data?.avatar_url
          });
        }
        return;
      }
      
      const json = await res.json();
      if (!json.success || !json.data) {
        console.error('Error fetching user profile:', json.message);
        // Fallback to auth data
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url || user.identities?.[0]?.identity_data?.avatar_url
          });
        }
        return;
      }
      
      // Set user data from backend response
      setUser({
        id: json.data.id || json.data.user_uuid || userId,
        email: json.data.email || '',
        full_name: json.data.full_name || json.data.name,
        avatar_url: json.data.avatar_url || json.data.profile_image
      });
      
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      // Fallback to auth data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url || user.identities?.[0]?.identity_data?.avatar_url
        });
      }
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsUserMenuOpen(false);
  };

  // Handle localStorage changes from other tabs/windows
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'plantomartCart' || event.key === 'plantomartWishlist') {
      loadCartAndWishlist();
    }
  };

  // Load cart and wishlist data from localStorage
  const loadCartAndWishlist = () => {
    const storedCart = localStorage.getItem('plantomartCart');
    const storedWishlist = localStorage.getItem('plantomartWishlist');
    
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart data:", e);
        setCartItems([]);
      }
    }
    
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist data:", e);
        setWishlistItems([]);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scrolling when drawer is open
    if (isCartOpen || isWishlistOpen || isMenuOpen || isSignInOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, isWishlistOpen, isMenuOpen, isSignInOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      // Close other drawers when closing menu
      setIsCartOpen(false);
      setIsWishlistOpen(false);
      setIsSignInOpen(false);
    }
  };

  const toggleMobileVendor = () => {
    setIsMobileVendorOpen(!isMobileVendorOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (isWishlistOpen) setIsWishlistOpen(false);
    if (isSignInOpen) setIsSignInOpen(false);
    // Close menu when opening cart
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
    if (isCartOpen) setIsCartOpen(false);
    if (isSignInOpen) setIsSignInOpen(false);
    // Close menu when opening wishlist
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleSignIn = () => {
    setIsSignInOpen(!isSignInOpen);
    // Close other drawers when opening sign-in
    if (isCartOpen) setIsCartOpen(false);
    if (isWishlistOpen) setIsWishlistOpen(false);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeDrawers = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsMenuOpen(false);
    setIsSignInOpen(false);
    setIsUserMenuOpen(false);
  };

  // Helper function to display cart/wishlist count
  const displayCount = (count: number) => {
    if (count > 5) return "5+";
    
    return count.toString(); 
  };

  // Calculate cart subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);
  };

  // Update item quantity in cart
  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('plantomartCart', JSON.stringify(updatedCart));
    
    // Dispatch event for other components
    const event = new CustomEvent('cartUpdated', { detail: updatedCart });
    window.dispatchEvent(event);
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    
    setCartItems(updatedCart);
    localStorage.setItem('plantomartCart', JSON.stringify(updatedCart));
    
    // Dispatch event for other components
    const event = new CustomEvent('cartUpdated', { detail: updatedCart });
    window.dispatchEvent(event);
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    
    setWishlistItems(updatedWishlist);
    localStorage.setItem('plantomartWishlist', JSON.stringify(updatedWishlist));
    
    // Dispatch event for other components
    const event = new CustomEvent('wishlistUpdated', { detail: updatedWishlist });
    window.dispatchEvent(event);
  };

  // Add wishlist item to cart
  const addWishlistItemToCart = (product: Product) => {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    let updatedCart:any;
    if (existingItemIndex >= 0) {
      // Increase quantity if already in cart
      updatedCart = cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Add new item with quantity 1
      const newItem: CartItem = { ...product, quantity: 1 };
      updatedCart = [...cartItems, newItem];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('plantomartCart', JSON.stringify(updatedCart));
    
    // Dispatch event for other components
    const event = new CustomEvent('cartUpdated', { detail: updatedCart });
    window.dispatchEvent(event);
  };
  
  return (
    <>
      <nav className={`fixed z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-white py-2 shadow-md' : 'bg-white py-2'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button - Left side */}
            <div className="flex items-center lg:hidden">
              <button 
                type='button'
                className="text-gray-700 hover:text-green-600" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <Menu className="size-6" />
              </button>
            </div>
            {/* Logo - Desktop Left aligned, Mobile centered */}
            <div className="flex flex-1 items-center justify-center lg:justify-start">
              <Link href="/" className="flex items-center">
                <div className="relative size-12">
                  <Image 
                    src="/assets/logo_Without_Text.png" 
                    alt="Plantomart Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-green-800 md:text-xl lg:ml-2 lg:text-2xl">plantomart</span>
              </Link>
            </div>
            {/* Desktop Navigation - Hidden on mobile - ADJUSTED POSITIONING */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:space-x-6">
              {/* Vendors Dropdown - FIXED DROPDOWN POSITIONING */}
              <div className="group relative">
                <Link href="/vendors" className="flex items-center text-gray-700 hover:text-green-600">
                  Vendors
                  <ChevronDown className="ml-1 size-4" />
                </Link>
                {/* Vendors Dropdown Menu - FIXED GAP AND POSITION */}
                <div className="absolute left-1/2 top-full z-50 mt-0 hidden w-screen max-w-5xl -translate-x-1/2 transform rounded-xl border border-gray-200 bg-white p-6 shadow-2xl group-hover:block">
                  {/* Added invisible padding bridge to prevent hover loss */}
                  <div className="absolute -top-4 left-0 h-4 w-full"></div>
                  <div className="flex w-full gap-10">
                    {/* Vendor List Column */}
                    <div className="w-1/3 border-r border-gray-100 pr-6">
                      <h3 className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Vendors</h3>
                      <ul className="space-y-3">
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Show Bageecha</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Super Saaf</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Leaf Grid</Link></li>
                        <li><Link href="#" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Plantify</Link></li>
                        <li><Link href="#" className="cursor-not-allowed text-gray-400">Surface Gauge <span className="text-xs italic text-gray-300">(Coming soon)</span></Link></li>
                      </ul>
                    </div>
                    {/* Product Column */}
                    <div className="w-1/3 border-r border-gray-100 pr-6">
                      <h3 className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">GROW WITH PLANTOMART</h3>
                      {/* <h3 className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Vendor HUB</h3> */}
                      <ul className="space-y-3">
                        <li><Link href="/vendor" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Browse Vendors</Link></li>
                        <li><Link href="/vendor/register" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Start Selling</Link></li>
                        <li><Link href="/guides" className="text-gray-700 transition-colors duration-200 hover:text-green-600">Help & Guides</Link></li>
                        <li><Link href="/vendor/dashboard" className="text-gray-700 transition-colors duration-200 hover:text-green-600">My Seller Hub</Link></li>
                      </ul>
                    </div>
                    {/* Promo Banner */}
                    <div className="w-1/3">
                      <div className="relative h-52 w-full overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-green-100 via-white to-green-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
                        <div className="absolute inset-0 bg-[url('/api/placeholder/500/300')] bg-cover bg-center opacity-20"></div>
                        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center text-green-900">
                          <h3 className="mb-1 text-2xl font-bold">25% OFF</h3>
                          <p className="text-sm font-medium">Shop at Planto-Mart</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/about" className="text-gray-700 hover:text-green-600">About</Link>
              <div className="group relative">
                <Link href="/blogs" className="flex items-center text-gray-700 hover:text-green-600">
                  Blog
                  <ChevronDown className="ml-1 size-4" />
                </Link>
                {/* Added dropdown container for Blog dropdown */}
                <div className="absolute left-0 top-full z-50 mt-0 hidden w-48 rounded-lg border border-gray-200 bg-white p-4 shadow-xl group-hover:block">
                  {/* Added invisible padding bridge to prevent hover loss */}
                  <div className="absolute -top-4 left-0 h-4 w-full"></div>
                  <ul className="space-y-2">
                    <li><Link href="/blog/green-living" className="block text-gray-700 hover:text-green-600">Green Living</Link></li>
                    {/* Tips for sustainable living, eco-friendly choices, and mindful consumption. */}
                    <li><Link href="/blog/plant-care-101" className="block text-gray-700 hover:text-green-600">Plant Care 101</Link></li>
                    {/* Guides for beginners and seasoned plant parents — watering, lighting, soil, etc. */}
                    <li><Link href="/blog/indoor-jungle" className="block text-gray-700 hover:text-green-600">Indoor Jungle</Link></li>
                    {/* Inspiration for styling homes/offices with plants, trends, and decor hacks. */}
                    <li><Link href="/blog/seasonal-gardening" className="block text-gray-700 hover:text-green-600">Seasonal Gardening</Link></li>
                    {/* Planting tips by season, climate-specific advice, and garden prep guides. */}
                  </ul>
                </div>
              </div>
              <div className="group relative">
                <div  className="flex items-center text-gray-700 hover:text-green-600">
                  company
                  <ChevronDown className="ml-1 size-4" />
                </div>
                {/* Added dropdown container for Page dropdown */}
                <div className="absolute left-0 top-full z-50 mt-0 hidden w-48 rounded-lg border border-gray-200 bg-white p-4 shadow-xl group-hover:block">
                  {/* Added invisible padding bridge to prevent hover loss */}
                  <div className="absolute -top-4 left-0 h-4 w-full"></div>
                  <ul className="space-y-2">
                    <li><Link href="/about" className="block text-gray-700 hover:text-green-600">About Us</Link></li>
                    <li><Link href="/faq" className="block text-gray-700 hover:text-green-600">FAQ</Link></li>
                  </ul>
                </div>
              </div>
              <Link href="/contact-us" className="text-gray-700 hover:text-green-600">Contact</Link>
            </div>
            {/* Desktop Actions Container - Added more separation from menu */}
            <div className="hidden items-center lg:flex lg:space-x-8">
              {/* Delivery Info - Now with more space from action icons */}
              <div className="flex items-center text-green-600">
                <div className="relative mr-3 flex size-10 items-center justify-center rounded-full bg-green-100 p-2">
                  <Truck className="size-5 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Reach Out At</span>
                  <span className="font-bold text-black">+91 833 180 1000</span>
                </div>
              </div>
              {/* Action Icons - With divider for visual separation */}
              <div className="flex items-center space-x-5 border-l border-gray-200 pl-6">
                <button type='button' className="text-gray-700 hover:text-green-600">
                  <Search className="size-5" />
                </button>
                {/* User Profile/Sign In Button */}
                {user ? (
                  <div className="relative">
                    <button 
                      type='button'
                      onClick={toggleUserMenu}
                      className="relative flex items-center"
                      aria-label="User menu"
                    >
                      {user.avatar_url ? (
                        <div className="relative size-8 overflow-hidden rounded-full border-2 border-green-200 transition-all hover:border-green-400">
                          <Image 
                            src={user.avatar_url} 
                            alt="User profile" 
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors hover:bg-green-200">
                          <User className="size-5" />
                        </div>
                      )}
                    </button>
                    {/* User dropdown menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
                        <div className="border-b border-gray-100 px-4 py-2">
                          <p className="font-medium text-gray-900">{user.full_name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link 
                          href="/account" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link 
                          href="/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button 
                          type='button'
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="mr-2 size-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    type='button'
                    onClick={toggleSignIn}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Sign in
                  </button>
                )}
                <div className="relative">
                  <button 
                    type='button'
                    className="text-gray-700 hover:text-green-600"
                    onClick={toggleCart}
                    aria-label="Cart"
                  >
                    {cartItems.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                        {displayCount(cartItems.length)}
                    </span>
                    )}
                    <ShoppingCart className="size-5" />
                  </button>
                </div>
                <div className="relative">
                  <button 
                    type='button'
                    className="text-gray-700 hover:text-green-600"
                    onClick={toggleWishlist}
                    aria-label="Wishlist"
                  >
                    {wishlistItems.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                        {displayCount(wishlistItems.length)}
                    </span>
                    )}
                    <Heart className="size-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile Right Actions */}
            <div className="flex items-center space-x-4 lg:hidden">
              {/* User Profile/Sign In Button for Mobile */}
              {user ? (
                <button 
                  type='button'
                  onClick={toggleUserMenu}
                  className="relative text-gray-700"
                  aria-label="User menu"
                >
                  {user.avatar_url ? (
                    <div className="relative size-7 overflow-hidden rounded-full border-2 border-green-200">
                      <Image 
                        src={user.avatar_url} 
                        alt="User profile" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <User className="size-5 text-gray-700 hover:text-green-600" />
                  )}
                </button>
              ) : (
                <button 
                  type='button'
                  onClick={toggleSignIn}
                  className="relative text-gray-700 hover:text-green-600"
                  aria-label="Sign in"
                >
                  <User className="size-5" />
                </button>
              )}
              {/* Phone icon - matches reference image */}
              <Link href="tel:+918331801000" className="relative text-gray-700 hover:text-green-600">
                <Phone className="size-5" />
              </Link>
              {/* Shopping Cart */}
              <button 
                type='button'
                className="relative text-gray-700 hover:text-green-600"
                onClick={toggleCart}
                aria-label="Cart"
              >
                {cartItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                    {displayCount(cartItems.length)}
                </span>
                )}
                <ShoppingCart className="size-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu - UPDATED with better header and UX */}
        {isMenuOpen && (
          <>
            {/* Overlay that covers the rest of the screen */}
            {/** biome-ignore lint/a11y/noStaticElementInteractions: will look into later */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: will look into later */}
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
              onClick={toggleMenu}
            ></div>
            {/* Side drawer menu that slides in from the left with improved header */}
            <div className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm overflow-hidden bg-white shadow-xl transition-transform lg:hidden">
              {/* Menu Header with close button */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-green-50 px-4 py-3">
                <div className="flex items-center">
                  <div className="relative mr-2 size-8">
                    <Image 
                      src="/assets/logo_Without_Text.png" 
                      alt="Plantomart Logo" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-lg font-bold text-green-800">plantomart</span>
                </div>
                <button 
                  type='button'
                  onClick={toggleMenu}
                  className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  <X className="size-6" />
                </button>
              </div>
              {/* Menu content with scrollable area */}
              <div className="h-[calc(100%-56px)] overflow-y-auto">
                <div className="p-4">
                  <div className="flex flex-col space-y-4">
                    {/* User Profile Section for Mobile Menu */}
                    {user ? (
                      <div className="mb-2 rounded-lg bg-green-50 p-4">
                        <div className="flex items-center">
                          {user.avatar_url ? (
                            <div className="relative mr-3 size-12 overflow-hidden rounded-full border-2 border-green-200">
                              <Image 
                                src={user.avatar_url} 
                                alt="User profile" 
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="mr-3 flex size-12 items-center justify-center rounded-full bg-green-100">
                              <User className="size-6 text-green-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{user.full_name || 'User'}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Link 
                            href="/account" 
                            className="rounded bg-white px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-green-50"
                            onClick={closeDrawers}
                          >
                            My Account
                          </Link>
                          <button 
                            type='button'
                            onClick={handleSignOut}
                            className="rounded bg-red-50 px-3 py-1.5 text-center text-sm font-medium text-red-600 shadow-sm hover:bg-red-100"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2 rounded-lg bg-green-50 p-4 text-center">
                        <p className="mb-3 text-sm text-gray-600">Sign in to access your account</p>
                        <button  
                          type='button'
                          onClick={() => {
                            toggleSignIn();
                            // toggleMenu();
                          }}
                          className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                          Sign in
                        </button>
                      </div>
                    )}
                    {/* Search bar with improved styling */}
                    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <Search className="mr-2 size-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="flex-1 bg-transparent text-gray-700 outline-none"
                      />
                    </div>
                    {/* Account shortcuts with improved visual design */}
                    <div className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-3">
                      <Link href="/account" className="flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-green-50">
                        <User className="mr-1.5 size-4 text-green-600" />
                        Account
                      </Link>
                      <Link href="/orders" className="flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-green-50">
                        <Truck className="mr-1.5 size-4 text-green-600" />
                        Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-green-50">
                        <Heart className="mr-1.5 size-4 text-green-600" />
                        Wishlist
                      </Link>
                    </div>
                    {/* Navigation Links */}
                    <div className="space-y-1">
                      <Link href="/" className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600">
                        Home
                      </Link>
                      {/* Vendors Dropdown */}
                      <div>
                        <button 
                          type='button'
                          onClick={toggleMobileVendor}
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
                        >
                          <span>Vendors</span>
                          {isMobileVendorOpen ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                        </button>
                        {isMobileVendorOpen && (
                          <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                            <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600">
                              Show Bageecha
                            </Link>
                            <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600">
                              Super Saaf
                            </Link>
                            <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600">
                              Leaf Grid
                            </Link>
                            <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600">
                              Plantify
                            </Link>
                          </div>
                        )}
                      </div>
                      <Link href="/about" className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600">
                        About
                      </Link>
                      {/* <Link href="/blogs" className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600">
                        Blog
                      </Link> */}
                      <div>
                        <button 
                          type='button'
                          onClick={toggleMobileVendor}
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
                        >
                          <span>Blogs</span>
                            <ChevronRight className="size-4" />
                        </button>
                        {isMobileVendorOpen && (
                          <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                            <Link href="/blog/category/green-living" className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600">
                              Green Living 
                            </Link>
                            <Link href="/blog/category/plant-care-101" className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600">
                              Plant Care 101
                            </Link>
                            <Link href="/blog/category/indoor-jungle" className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600">
                              Indoor Jungle
                            </Link>
                            <Link href="/blog/category/seasonal-gardening" className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600">
                              Seasonal Gardening
                            </Link>
                          </div>
                        )}
                      </div>
                      <Link href="/contact-us" className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600">
                        Contact
                      </Link>
                    </div>
                    {/* Contact Info */}
                    <div className="mt-4 rounded-lg bg-green-50 p-3">
                      <h3 className="mb-2 text-sm font-medium text-green-800">Need Help?</h3>
                      <div className="flex items-center">
                        <Phone className="mr-2 size-4 text-green-600" />
                        <Link href="tel:+918331801000" className="text-sm font-medium text-green-700 hover:text-green-800">
                          +91 833 180 1000
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Cart Drawer */}
        {isCartOpen && (
          <>
            {/* Overlay */}
            {/* * biome-ignore lint/a11y/noStaticElementInteractions: will look into this alatetrr */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: will look into while refactoring */}
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
              onClick={toggleCart}
            ></div>
            {/* Cart Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-hidden bg-white shadow-xl transition-transform">
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h2 className="text-lg font-medium text-gray-900">Shopping Cart ({cartItems.length})</h2>
                <button 
                  type='button'
                  onClick={toggleCart}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
                  aria-label="Close cart"
                >
                  <X className="size-6" />
                </button>
              </div>
              {/* Cart Content */}
              <div className="flex h-[calc(100%-60px)] flex-col">
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  {cartItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="rounded-full bg-gray-100 p-3">
                        <ShoppingCart className="size-8 text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                      <p className="mt-1 text-center text-sm text-gray-500">
                        Looks like you haven't added any plants to your cart yet.
                      </p>
                      <button
                        type='button'
                        onClick={toggleCart}
                        className="mt-6 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex py-4">
                          {/* Product Image */}
                          <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                            {item.tag && (
                              <span className="absolute left-0 top-0 rounded-br-md bg-yellow-500 px-1.5 py-0.5 text-xs font-medium text-white">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          {/* Product Details */}
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3 className="text-sm">{item.title}</h3>
                                <p className="ml-4 text-sm">{item.price}</p>
                              </div>
                            </div>
                            <div className="flex flex-1 items-end justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center rounded-md border border-gray-200">
                                <button
                                  type='button'
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                  className="rounded-l-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="size-4" />
                                </button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <button
                                  type='button'
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                  className="rounded-r-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                                >
                                  <Plus className="size-4" />
                                </button>
                              </div>
                              {/* Remove Button */}
                              <button
                                type='button'
                                onClick={() => removeFromCart(item.id)}
                                className="text-xs font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Cart Footer */}
                {cartItems.length > 0 && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>₹{calculateSubtotal().toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-4">
                      <Link
                        href="/checkout"
                        className="flex items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700"
                        onClick={closeDrawers}
                      >
                        Checkout
                      </Link>
                    </div>
                    <div className="mt-2 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="font-medium text-green-600 hover:text-green-500"
                          onClick={toggleCart}
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {/* Wishlist Drawer */}
        {isWishlistOpen && (
          <>
            {/* Overlay */}
            {/** biome-ignore lint/a11y/noStaticElementInteractions: will look into this later */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: will look into this later */}
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
              onClick={toggleWishlist}
            ></div>
            {/* Wishlist Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-hidden bg-white shadow-xl transition-transform">
              {/* Wishlist Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h2 className="text-lg font-medium text-gray-900">Wishlist ({wishlistItems.length})</h2>
                <button 
                  type='button'
                  onClick={toggleWishlist}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
                  aria-label="Close wishlist"
                >
                  <X className="size-6" />
                </button>
              </div>
              {/* Wishlist Content */}
              <div className="flex h-[calc(100%-60px)] flex-col">
                {/* Wishlist Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  {wishlistItems.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="rounded-full bg-gray-100 p-3">
                        <Heart className="size-8 text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                      <p className="mt-1 text-center text-sm text-gray-500">
                        Save your favorite plants for later.
                      </p>
                      <button
                        type='button'
                        onClick={toggleWishlist}
                        className="mt-6 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {wishlistItems.map((item) => (
                        <li key={item.id} className="flex py-4">
                          {/* Product Image */}
                          <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                            {item.tag && (
                              <span className="absolute left-0 top-0 rounded-br-md bg-yellow-500 px-1.5 py-0.5 text-xs font-medium text-white">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          {/* Product Details */}
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3 className="text-sm">{item.title}</h3>
                                <p className="ml-4 text-sm">{item.price}</p>
                              </div>
                            </div>
                            <div className="flex flex-1 items-end justify-between">
                              {/* Add to Cart Button */}
                              <button
                                type='button'
                                onClick={() => addWishlistItemToCart(item)}
                                className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                              >
                                Add to Cart
                              </button>
                              {/* Remove Button */}
                              <button
                                type='button'
                                onClick={() => removeFromWishlist(item.id)}
                                className="text-xs font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {/* Sign In Modal */}
        {isSignInOpen && <SignIn isOpen={isSignInOpen} onClose={toggleSignIn} />}
      </nav>
      {/* Spacer to prevent content from being hidden under the fixed navbar */}
      <div className={`h-16 md:h-20 ${isClient ? '' : 'invisible'}`}></div>
    </>
  );
}

export default Navbar;