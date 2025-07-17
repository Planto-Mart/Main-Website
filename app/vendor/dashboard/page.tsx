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
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
          return;
        }
        
        setIsVendor(true);
        
        // Fetch mock data for demonstration
        fetchMockData();
        
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
          fetchMockData();
        } else {
          setIsVendor(false);
        }
      } catch (error) {
        console.error('Error fetching profile or checking vendor status:', error);
        setIsVendor(false);
      }
    }
    
    setAuthChecking(false);
    setLoading(false);
  };

  // Fetch mock data for demonstration purposes
  const fetchMockData = () => {
    // Mock statistics
    setStats({
      totalSales: 24580,
      totalOrders: 156,
      totalProducts: 48,
      totalCustomers: 89,
      pendingOrders: 12,
      lowStockProducts: 5
    });
    
    // Mock products
    setProducts([
      { id: 'PRD-001', name: 'Monstera Deliciosa', category: 'Indoor Plants', price: 1200, stock: 15, status: 'active', image: '/assets/products/monstera.jpg' },
      { id: 'PRD-002', name: 'Snake Plant', category: 'Indoor Plants', price: 850, stock: 23, status: 'active', image: '/assets/products/snake-plant.jpg' },
      { id: 'PRD-003', name: 'Fiddle Leaf Fig', category: 'Indoor Plants', price: 1800, stock: 8, status: 'active', image: '/assets/products/fiddle-leaf.jpg' },
      { id: 'PRD-004', name: 'Peace Lily', category: 'Indoor Plants', price: 950, stock: 3, status: 'low-stock', image: '/assets/products/peace-lily.jpg' },
      { id: 'PRD-005', name: 'Pothos', category: 'Hanging Plants', price: 650, stock: 19, status: 'active', image: '/assets/products/pothos.jpg' },
      { id: 'PRD-006', name: 'Rubber Plant', category: 'Indoor Plants', price: 1100, stock: 12, status: 'active', image: '/assets/products/rubber-plant.jpg' },
      { id: 'PRD-007', name: 'ZZ Plant', category: 'Indoor Plants', price: 950, stock: 2, status: 'low-stock', image: '/assets/products/zz-plant.jpg' },
      { id: 'PRD-008', name: 'Aloe Vera', category: 'Succulents', price: 550, stock: 25, status: 'active', image: '/assets/products/aloe-vera.jpg' }
    ]);
    
    // Mock orders
    setOrders([
      { id: 'ORD-7829', customer: 'Rahul Sharma', date: '2023-06-15', total: 1250, status: 'delivered', items: 3, payment: 'completed' },
      { id: 'ORD-7830', customer: 'Priya Patel', date: '2023-06-14', total: 850, status: 'processing', items: 2, payment: 'completed' },
      { id: 'ORD-7831', customer: 'Amit Kumar', date: '2023-06-14', total: 3200, status: 'shipped', items: 5, payment: 'completed' },
      { id: 'ORD-7832', customer: 'Neha Singh', date: '2023-06-13', total: 1600, status: 'delivered', items: 4, payment: 'completed' },
      { id: 'ORD-7833', customer: 'Vikram Reddy', date: '2023-06-12', total: 950, status: 'processing', items: 2, payment: 'completed' },
      { id: 'ORD-7834', customer: 'Ananya Desai', date: '2023-06-11', total: 2100, status: 'delivered', items: 3, payment: 'completed' },
      { id: 'ORD-7835', customer: 'Rajesh Khanna', date: '2023-06-10', total: 750, status: 'cancelled', items: 1, payment: 'refunded' },
      { id: 'ORD-7836', customer: 'Meera Iyer', date: '2023-06-09', total: 1850, status: 'delivered', items: 4, payment: 'completed' },
      { id: 'ORD-7837', customer: 'Karthik Nair', date: '2023-06-08', total: 1200, status: 'delivered', items: 2, payment: 'completed' },
      { id: 'ORD-7838', customer: 'Divya Sharma', date: '2023-06-07', total: 3500, status: 'delivered', items: 6, payment: 'completed' }
    ]);
    
    // Mock reviews
    setReviews([
      { id: 'REV-001', product: 'Monstera Deliciosa', customer: 'Rahul Sharma', date: '2023-06-10', rating: 5, comment: 'Beautiful plant, arrived in perfect condition. Very happy with my purchase!', status: 'published' },
      { id: 'REV-002', product: 'Snake Plant', customer: 'Priya Patel', date: '2023-06-09', rating: 4, comment: 'Healthy plant, slightly smaller than expected but growing well.', status: 'published' },
      { id: 'REV-003', product: 'Fiddle Leaf Fig', customer: 'Amit Kumar', date: '2023-06-08', rating: 5, comment: 'Excellent quality and packaging. The plant is thriving in my living room.', status: 'published' },
      { id: 'REV-004', product: 'Peace Lily', customer: 'Neha Singh', date: '2023-06-07', rating: 3, comment: 'Plant arrived with some damaged leaves, but customer service was helpful.', status: 'published' },
      { id: 'REV-005', product: 'Pothos', customer: 'Vikram Reddy', date: '2023-06-06', rating: 5, comment: 'Perfect hanging plant! Growing so fast and looks beautiful.', status: 'published' },
      { id: 'REV-006', product: 'Rubber Plant', customer: 'Ananya Desai', date: '2023-06-05', rating: 4, comment: 'Healthy plant with glossy leaves. Very satisfied with my purchase.', status: 'published' }
    ]);
    
    // Mock customers
    setCustomers([
      { id: 'CUST-001', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', orders: 5, totalSpent: 4500, lastOrder: '2023-06-15' },
      { id: 'CUST-002', name: 'Priya Patel', email: 'priya.patel@example.com', orders: 3, totalSpent: 2800, lastOrder: '2023-06-14' },
      { id: 'CUST-003', name: 'Amit Kumar', email: 'amit.kumar@example.com', orders: 7, totalSpent: 8500, lastOrder: '2023-06-14' },
      { id: 'CUST-004', name: 'Neha Singh', email: 'neha.singh@example.com', orders: 4, totalSpent: 3600, lastOrder: '2023-06-13' },
      { id: 'CUST-005', name: 'Vikram Reddy', email: 'vikram.reddy@example.com', orders: 2, totalSpent: 1900, lastOrder: '2023-06-12' },
      { id: 'CUST-006', name: 'Ananya Desai', email: 'ananya.desai@example.com', orders: 6, totalSpent: 5200, lastOrder: '2023-06-11' }
    ]);
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
          <ProductsTab products={products} />
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
      </div>
    </div>
  );
}