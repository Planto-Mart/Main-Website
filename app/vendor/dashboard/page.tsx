/* eslint-disable no-unused-vars */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: not in need of this  thinking of disabling this globally */
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Store } from 'lucide-react';

import { supabase } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';
import SignIn from '@/components/auth/Sign-in';
import Sidebar from '@/components/vendor/Dashboard/Sidebar';
import OverviewTab from '@/components/vendor/Dashboard/OverviewTab';
import ProductsTab from '@/components/vendor/Dashboard/ProductsTab';
import OrdersTab from '@/components/vendor/Dashboard/OrdersTab';
import ReviewsTab from '@/components/vendor/Dashboard/ReviewsTab';
import CustomersTab from '@/components/vendor/Dashboard/CustomersTab';
import SettingsTab from '@/components/vendor/Dashboard/SettingsTab';
import StoreBrandingTab from '@/components/vendor/Dashboard/StoreBrandingTab';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [vendorData, setVendorData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);
  
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      setAuthChecking(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setShowSignIn(true);
        setAuthChecking(false);
        return;
      }
      
      setUser(session.user);
      setIsAuthenticated(true);
      
      // Fetch profile data from backend API
      const res = await fetch(API_ENDPOINTS.getProfileByUUID(session.user.id), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const profileJson = await res.json();
      if (!profileJson.success || !profileJson.data) {
        throw new Error(profileJson.message || 'Profile not found');
      }
      
      let profileData = profileJson.data;
      if (profileData.user_login_info && typeof profileData.user_login_info === 'string') {
        try {
          profileData.user_login_info = JSON.parse(profileData.user_login_info);
        } catch (e) {
          // Handle parsing error silently
        }
      }
      setVendorData(profileData);
      
      // Check if user is a vendor by fetching all vendor profiles
      try {
        const vendorRes = await fetch(API_ENDPOINTS.getAllVendorsAdmin, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!vendorRes.ok) {
          throw new Error('Failed to fetch vendor profiles');
        }
        
        const vendorJson = await vendorRes.json();
        if (!vendorJson.success || !Array.isArray(vendorJson.data)) {
          throw new Error(vendorJson.message || 'Vendor data error');
        }
        
        // Try to match by user_uuid, user_id, or vendor_id
        const found = vendorJson.data.find((v: any) =>
          v.user_uuid === session.user.id ||
          v.user_id === session.user.id ||
          v.vendor_id === session.user.id
        );
        
        if (!found) {
          setIsVendor(false);
          setAuthChecking(false);
          setLoading(false);
          setVendorId(null);
          return;
        }
        
        setIsVendor(true);
        setVendorId(found.vendor_id || found.user_uuid || found.user_id);
        // Fetch real products for this vendor
        if (found.vendor_id || found.user_uuid || found.user_id) {
          fetchProducts(found.vendor_id || found.user_uuid || found.user_id);
        }
        
      } catch (vendorError) {
        console.error('Error checking vendor status:', vendorError);
        setIsVendor(false);
      }
      
      setAuthChecking(false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthChecking(false);
      setLoading(false);
    }
  };

  // Check authentication and fetch vendor data
  // biome-ignore lint/correctness/useExhaustiveDependencies: will look upon during refactor
  useEffect(() => {
    fetchUserData();
  }, [router]);

  // Handle successful authentication (gotta look for this usage why not used during refactor)
  const _handleAuthSuccess = async () => {
    setAuthChecking(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setUser(session.user);
      setIsAuthenticated(true);
      setShowSignIn(false);
      
      // Fetch profile data from API
      try {
        const res = await fetch(API_ENDPOINTS.getProfileByUUID(session.user.id), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const profileJson = await res.json();
        if (!profileJson.success || !profileJson.data) {
          throw new Error(profileJson.message || 'Profile not found');
        }
        
        let profileData = profileJson.data;
        if (profileData.user_login_info && typeof profileData.user_login_info === 'string') {
          try {
            profileData.user_login_info = JSON.parse(profileData.user_login_info);
          } catch (e) {
            // Handle parsing error silently
          }
        }
        
        setVendorData(profileData);
        
        // Check if user is a vendor by fetching all vendor profiles
        const vendorRes = await fetch(API_ENDPOINTS.getAllVendorsAdmin, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!vendorRes.ok) {
          throw new Error('Failed to fetch vendor profiles');
        }
        
        const vendorJson = await vendorRes.json();
        if (!vendorJson.success || !Array.isArray(vendorJson.data)) {
          throw new Error(vendorJson.message || 'Vendor data error');
        }
        
        // Try to match by user_uuid, user_id, or vendor_id
        const found = vendorJson.data.find((v: any) =>
          v.user_uuid === session.user.id ||
          v.user_id === session.user.id ||
          v.vendor_id === session.user.id
        );
        
        if (found) {
          setIsVendor(true);
          setVendorId(found.vendor_id || found.user_uuid || found.user_id);
          if (found.vendor_id || found.user_uuid || found.user_id) {
            fetchProducts(found.vendor_id || found.user_uuid || found.user_id);
          }
        } else {
          setIsVendor(false);
          setVendorId(null);
        }
      } catch (error) {
        console.error('Error fetching profile or checking vendor status:', error);
        setIsVendor(false);
      }
    }
    
    setAuthChecking(false);
    setLoading(false);
  };

  // Fetch products from API
  const fetchProducts = async (vendorId: string | null | undefined) => {
    if (!vendorId) {
      setProductsError('Vendor ID is missing');
      setProducts([]);
      return;
    }
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await fetch(API_ENDPOINTS.getProductsByVendor(vendorId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) throw new Error(json.message || 'Product data error');
      setProducts(json.data);
    } catch (err: any) {
      setProductsError(err.message || 'Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsVendor(false);
      setUser(null);
      setVendorData(null);
      setShowSignIn(true);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Render loading state
  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 size-12 animate-spin text-green-600" />
          <h2 className="text-xl font-semibold text-gray-700">Checking authentication...</h2>
        </div>
      </div>
    );
  }

  // Render authentication modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gray-50">
        {/* Blurred background */}
        <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm"></div>
        {/* Content in background */}
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4 opacity-20">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-6 text-center">
              <div className="relative mx-auto mb-4 size-16">
                <Image 
                  src="/assets/logo_Without_Text.png" 
                  alt="Plantomart Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600">Manage your store, products, and orders</p>
            </div>
          </div>
        </div>
        {/* Authentication modal */}
        <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 text-center">
              <div className="relative mx-auto mb-4 size-12">
                <Image 
                  src="/assets/logo_Without_Text.png" 
                  alt="Plantomart Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Sign In Required</h2>
              <p className="text-sm text-gray-600">Please sign in to access the vendor dashboard</p>
            </div>
            <SignIn 
              isOpen={showSignIn} 
              onClose={() => user && setShowSignIn(false)} 
              redirectUrl="/vendor/dashboard"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render vendor registration prompt if authenticated but not a vendor
  if (isAuthenticated && !isVendor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <Store className="size-8 text-green-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Become a Vendor</h1>
            <p className="mb-6 text-gray-600">
              You need to register as a vendor to access the dashboard and start selling your products.
            </p>
            <div className="flex flex-col space-y-4">
              <Link 
                href="/vendor/register" 
                className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Register as Vendor
              </Link>
              {/** biome-ignore lint/a11y/useButtonType: during refactor checking to use or not */}
              <button
                onClick={handleSignOut}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state for dashboard data
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 size-12 animate-spin text-green-600" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  // Main dashboard UI for authenticated vendors
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Header - Only visible on mobile */}
      <div className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative mr-2 size-8">
              <Image 
                src="/assets/logo_Without_Text.png" 
                alt="Plantomart Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-lg font-bold text-gray-800">Vendor Dashboard</h1>
          </div>
          {/** biome-ignore lint/a11y/useButtonType: will check during refactor process */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
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
      {/* Sidebar - Using the Sidebar component */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} fixed inset-0 z-20 md:relative md:block`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          vendorData={vendorData} 
          isMenuOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
        {/* Store Branding Tab Button (for mobile/desktop sidebar) */}
        <div className="md:hidden flex flex-col border-t border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('storeBranding')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${activeTab === 'storeBranding' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span className="mr-3">🌿</span> Store Branding
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        {/* Render the appropriate tab component based on activeTab */}
        {activeTab === 'overview' && (
          <OverviewTab 
            email={user?.email} 
            totalSales={`${stats.totalSales.toLocaleString()}`}
            totalOrders={`${stats.totalOrders}`}
            totalProducts={`${stats.totalProducts}`}
            onViewAllClick={() => setActiveTab('orders')}
          />
        )}
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            loading={productsLoading}
            error={productsError}
            onRefresh={() => vendorId && fetchProducts(vendorId)}
            user={user}
            vendorId={vendorId}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersTab orders={orders} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab reviews={reviews} />
        )}
        {activeTab === 'customers' && (
          <CustomersTab customers={customers} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab vendorData={vendorData} />
        )}
        {activeTab === 'storeBranding' && (
          <StoreBrandingTab />
        )}
      </div>
    </div>
  );
}