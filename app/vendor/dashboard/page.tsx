/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Star, 
  Settings, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2,
  LogOut,
  Store
} from 'lucide-react';

import { supabase } from '@/utils/supabase/client';
import SignIn from '@/components/auth/Sign-in';

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
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const router = useRouter();

  // Check authentication and fetch vendor data
  useEffect(() => {
    const checkAuth = async () => {
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
        
        // Fetch vendor profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles_dev')
          .select('*')
          .eq('uuid', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setAuthChecking(false);
          setLoading(false);
          
return;
        }
        
        // Check if user is a vendor
        if (!profileData.is_vendor) {
          setIsVendor(false);
          setAuthChecking(false);
          setLoading(false);
          
return;
        }
        
        setIsVendor(true);
        setVendorData(profileData);
        
        // Fetch mock data for demonstration
        fetchMockData();
        
        setAuthChecking(false);
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthChecking(false);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Handle successful authentication
  const handleAuthSuccess = async () => {
    setAuthChecking(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setUser(session.user);
      setIsAuthenticated(true);
      setShowSignIn(false);
      
      // Fetch vendor profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles_dev')
        .select('*')
        .eq('uuid', session.user.id)
        .single();
      
      if (!profileError && profileData.is_vendor) {
        setIsVendor(true);
        setVendorData(profileData);
        fetchMockData();
      } else {
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
    
    // Mock recent orders
    setRecentOrders([
      { id: 'ORD-7829', customer: 'Rahul Sharma', date: '2023-06-15', total: 1250, status: 'delivered', items: 3 },
      { id: 'ORD-7830', customer: 'Priya Patel', date: '2023-06-14', total: 850, status: 'processing', items: 2 },
      { id: 'ORD-7831', customer: 'Amit Kumar', date: '2023-06-14', total: 3200, status: 'shipped', items: 5 },
      { id: 'ORD-7832', customer: 'Neha Singh', date: '2023-06-13', total: 1600, status: 'delivered', items: 4 },
      { id: 'ORD-7833', customer: 'Vikram Reddy', date: '2023-06-12', total: 950, status: 'processing', items: 2 }
    ]);
    
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

  // Filter products based on search term and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Get status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'low-stock':
        return 'bg-amber-100 text-amber-800';
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
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
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isMenuOpen ? 'block' : 'hidden'} fixed inset-0 z-20 h-full w-64 bg-white shadow-lg transition-transform md:relative md:block md:translate-x-0`}>
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center">
                <div className="relative mr-2 size-8">
                  <Image 
                    src="/assets/logo_Without_Text.png" 
                    alt="Plantomart Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-lg font-bold text-gray-800">PlantoMart</h2>
              </div>
              <div className="mt-4">
                <div className="rounded-md bg-green-50 p-3">
                  <div className="flex items-center">
                    <div className="mr-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <ShoppingBag className="size-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-800">Vendor Store</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {vendorData?.vendor_details?.store_name || 'Your Store'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                      activeTab === 'overview' 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="mr-3 size-5" />
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                      activeTab === 'products' 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Package className="mr-3 size-5" />
                    Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                      activeTab === 'orders' 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ShoppingBag className="mr-3 size-5" />
                    Orders
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                      activeTab === 'reviews' 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Star className="mr-3 size-5" />
                    Reviews
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('customers')}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                      activeTab === 'customers' 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="mr-3 size-5" />
                    Customers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                      activeTab === 'settings' 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="mr-3 size-5" />
                    Settings
                  </button>
                </li>
              </ul>
            </nav>
            {/* Sidebar Footer */}
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-3 size-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-4 md:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, {user?.email}</p>
              </div>
              {/* Stats Grid */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Sales */}
                <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-green-100">
                      <TrendingUp className="size-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-medium text-green-600">
                    <ArrowUpRight className="mr-1 size-3" />
                    <span>12% from last month</span>
                  </div>
                </div>
                {/* Total Orders */}
                <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-purple-100">
                      <ShoppingBag className="size-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-medium text-purple-600">
                    <ArrowUpRight className="mr-1 size-3" />
                    <span>8% from last month</span>
                  </div>
                </div>
                {/* Total Products */}
                <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-blue-100">
                      <Package className="size-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-medium text-blue-600">
                    <Plus className="mr-1 size-3" />
                    <span>5 new this month</span>
                  </div>
                </div>
              </div>
              {/* Alerts Section */}
              <div className="mb-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Alerts & Notifications</h2>
                <div className="space-y-3">
                  {/* Pending Orders Alert */}
                  {stats.pendingOrders > 0 && (
                    <div className="flex items-start rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="mr-3 mt-0.5">
                        <Clock className="size-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-amber-800">Pending Orders</h3>
                        <p className="text-sm text-amber-700">
                          You have {stats.pendingOrders} orders awaiting processing.
                        </p>
                        <button 
                                                  onClick={() => setActiveTab('orders')}
                          className="mt-1 text-xs font-medium text-amber-800 hover:text-amber-900"
                        >
                          View Orders →
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Low Stock Alert */}
                  {stats.lowStockProducts > 0 && (
                    <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-3">
                      <div className="mr-3 mt-0.5">
                        <AlertCircle className="size-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
                        <p className="text-sm text-red-700">
                          {stats.lowStockProducts} products are running low on inventory.
                        </p>
                        <button 
                          onClick={() => setActiveTab('products')}
                          className="mt-1 text-xs font-medium text-red-800 hover:text-red-900"
                        >
                          View Products →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Recent Orders */}
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Order ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Customer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Total
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{order.id}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm text-gray-900">{order.customer}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm text-gray-500">{order.date}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">₹{order.total}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-4 md:p-6">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                  <p className="text-gray-600">Manage your product inventory</p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  <Plus className="mr-2 size-4" />
                  Add Product
                </button>
              </div>
              {/* Search and Filter */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="size-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative inline-block">
                  <div className="flex">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={() => {}}
                    >
                      <Filter className="mr-2 size-4 text-gray-500" />
                      Filter
                      <ChevronDown className="ml-1 size-4 text-gray-500" />
                    </button>
                  </div>
                  {/* Filter dropdown would go here */}
                </div>
              </div>
              {/* Products Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center">
                              <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                <Image
                                  src={product.image || '/assets/placeholder.jpg'}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{product.category}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{product.stock}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(product.status)}`}>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <Eye className="size-4" />
                              </button>
                              <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <Edit className="size-4" />
                              </button>
                              <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-700">
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="p-4 md:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600">Manage and track your customer orders</p>
              </div>
              {/* Search and Filter */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="size-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative inline-block">
                  <div className="flex">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={() => {}}
                    >
                      <Filter className="mr-2 size-4 text-gray-500" />
                      Filter
                      <ChevronDown className="ml-1 size-4 text-gray-500" />
                    </button>
                  </div>
                  {/* Filter dropdown would go here */}
                </div>
              </div>
              {/* Orders Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{order.customer}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-500">{order.date}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">₹{order.total}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <Eye className="size-4" />
                              </button>
                              <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                <Edit className="size-4" />
                              </button>
                              <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-700">
                                <MoreHorizontal className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="p-4 md:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                <p className="text-gray-600">Manage customer reviews for your products</p>
              </div>
              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                          {review.customer.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{review.customer}</h3>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`size-4 ${
                                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <h4 className="mb-1 text-sm font-medium text-gray-900">
                        Product: {review.product}
                      </h4>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Reply
                      </button>
                      {review.status !== 'published' && (
                        <button className="rounded-md border border-green-600 bg-white px-3 py-1 text-xs font-medium text-green-600 shadow-sm hover:bg-green-50">
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="p-4 md:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-gray-600">View and manage your customer information</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
                  <Users className="size-8 text-gray-500" />
                </div>
                <h2 className="mb-2 text-lg font-medium text-gray-900">Customer Management</h2>
                <p className="mb-4 text-gray-600">
                  This feature is coming soon. You'll be able to view customer details, purchase history, and more.
                </p>
              </div>
            </div>
          )}
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-4 md:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
                <p className="text-gray-600">Manage your store preferences and account settings</p>
              </div>
              <div className="space-y-6">
                {/* Store Information */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <h2 className="text-base font-medium text-gray-900">Store Information</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="store-name" className="block text-sm font-medium text-gray-700">
                          Store Name
                        </label>
                        <input
                          type="text"
                          id="store-name"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                          defaultValue={vendorData?.vendor_details?.store_name || ''}
                        />
                      </div>
                      <div>
                        <label htmlFor="store-description" className="block text-sm font-medium text-gray-700">
                          Store Description
                        </label>
                        <textarea
                          id="store-description"
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                          defaultValue={vendorData?.vendor_details?.description || ''}
                        />
                      </div>
                      <div>
                        <label htmlFor="store-email" className="block text-sm font-medium text-gray-700">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          id="store-email"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                          defaultValue={vendorData?.email || user?.email || ''}
                        />
                      </div>
                      <div>
                        <label htmlFor="store-phone" className="block text-sm font-medium text-gray-700">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          id="store-phone"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                          defaultValue={vendorData?.vendor_details?.phone || ''}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
                {/* Account Settings */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <h2 className="text-base font-medium text-gray-900">Account Settings</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="account-email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="account-email"
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                          value={user?.email || ''}
                          disabled
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          To change your email, please contact support.
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}