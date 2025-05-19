"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, Package, Heart, CreditCard, LogOut, Settings, Edit, Camera, 
  Truck, Clock, CheckCircle, AlertCircle, ChevronRight, ShoppingBag, 
  MapPin, Phone, Shield, Bell, HelpCircle, Loader2
} from 'lucide-react';

import { supabase } from '../../utils/supabase/client';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/');
          
            return;
        }
        
        setUser(session.user);
        
        // Fetch profile data
        console.log('Fetching profile data for user:', session.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles_dev')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
          setUpdatedProfile(profileData);
        }
        
        // Fetch mock orders (replace with real data when available)
        setOrders(getMockOrders());
        
        // Fetch mock addresses (replace with real data when available)
        setAddresses(getMockAddresses());
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('profiles_dev')
        .update({
          full_name: updatedProfile.full_name,
          phone: updatedProfile.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setProfile({
        ...profile,
        full_name: updatedProfile.full_name,
        phone: updatedProfile.phone,
        updated_at: new Date().toISOString(),
      });
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value,
    });
  };

  // Mock data functions (replace with real data fetching)
  const getMockOrders = () => {
    return [
      {
        id: 'ORD-1234',
        date: '2023-05-15',
        total: 2499,
        status: 'delivered',
        items: [
          { id: 1, name: 'Money Plant', quantity: 2, price: 499 },
          { id: 2, name: 'Snake Plant', quantity: 1, price: 1499 }
        ]
      },
      {
        id: 'ORD-5678',
        date: '2023-06-02',
        total: 3299,
        status: 'processing',
        items: [
          { id: 3, name: 'Bonsai Tree', quantity: 1, price: 2999 },
          { id: 4, name: 'Plant Food', quantity: 1, price: 299 }
        ]
      },
      {
        id: 'ORD-9012',
        date: '2023-06-20',
        total: 1799,
        status: 'shipped',
        items: [
          { id: 5, name: 'Aloe Vera', quantity: 3, price: 599 }
        ]
      }
    ];
  };

  const getMockAddresses = () => {
    return [
      {
        id: 1,
        type: 'Home',
        default: true,
        name: 'John Doe',
        street: '123 Green Avenue',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500008',
        phone: '+91 9876543210'
      },
      {
        id: 2,
        type: 'Office',
        default: false,
        name: 'John Doe',
        street: '456 Tech Park, Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066',
        phone: '+91 9876543210'
      }
    ];
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            <CheckCircle className="mr-1 size-3" />
            Delivered
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            <Clock className="mr-1 size-3" />
            Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
            <Truck className="mr-1 size-3" />
            Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            <AlertCircle className="mr-1 size-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-12 animate-spin text-green-600" />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    
return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      {/* Decorative Header */}
      <div className="relative mb-8 h-24 w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600">
        <div className="h-1 w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="relative -mt-32 rounded-lg bg-white p-6 shadow-lg md:p-8">
          {/* Account Header */}
          <div className="mb-8 flex flex-col items-center border-b border-gray-200 pb-6 md:flex-row md:items-start md:pb-8">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div className="relative size-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                {profile?.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-green-100 text-green-600">
                    <User className="size-12" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-green-600 p-1.5 text-white shadow-md hover:bg-green-700">
                <Camera className="size-4" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{profile?.full_name || 'User'}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="mt-1 text-sm text-gray-500">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                <button 
                  onClick={handleSignOut}
                  className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <LogOut className="mr-1.5 size-4 text-gray-500" />
                  Sign Out
                </button>
                <Link 
                  href="/account/settings" 
                  className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Settings className="mr-1.5 size-4 text-gray-500" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
          {/* Account Navigation */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max space-x-1 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center whitespace-nowrap px-4 py-2 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <User className="mr-2 size-4" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center whitespace-nowrap px-4 py-2 text-sm font-medium ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Package className="mr-2 size-4" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex items-center whitespace-nowrap px-4 py-2 text-sm font-medium ${
                  activeTab === 'addresses'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <MapPin className="mr-2 size-4" />
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex items-center whitespace-nowrap px-4 py-2 text-sm font-medium ${
                  activeTab === 'wishlist'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Heart className="mr-2 size-4" />
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex items-center whitespace-nowrap px-4 py-2 text-sm font-medium ${
                  activeTab === 'payments'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <CreditCard className="mr-2 size-4" />
                Payment Methods
              </button>
            </div>
          </div>
          {/* Content Area */}
          <div className="min-h-[400px]">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="shrink-0">
                        <AlertCircle className="size-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="mb-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="shrink-0">
                        <CheckCircle className="size-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{success}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    {editMode ? 'Cancel' : (
                      <>
                        <Edit className="mr-1 size-4" />
                        Edit
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          value={updatedProfile.full_name || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={user.email}
                          disabled
                          className="mt-1 block w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Email cannot be changed. Contact support for assistance.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={updatedProfile.phone || ''}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={handleProfileUpdate}
                          disabled={saving}
                          className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                          <p className="mt-1 text-sm text-gray-900">{profile?.full_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                          <p className="mt-1 text-sm text-gray-900">{profile?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(user.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900">Account Preferences</h2>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="size-5 text-gray-400" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                            <p className="text-xs text-gray-500">Manage your email and push notifications</p>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="size-5 text-gray-400" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">Security</h3>
                            <p className="text-xs text-gray-500">Update password and security settings</p>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <HelpCircle className="size-5 text-gray-400" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">Help & Support</h3>
                            <p className="text-xs text-gray-500">Get help with your account or orders</p>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
                  <Link 
                    href="/shop" 
                    className="text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
                {orders.length === 0 ? (
                  <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-100">
                      <ShoppingBag className="size-8 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      When you place your first order, it will appear here.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/shop"
                        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Browse Plants
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                Order #{order.id}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              {renderStatusBadge(order.status)}
                              <Link 
                                href={`/account/orders/${order.id}`}
                                className="text-xs font-medium text-green-600 hover:text-green-700"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 sm:px-6">
                          <div className="flow-root">
                            <ul className="-my-5 divide-y divide-gray-200">
                              {order.items.map((item: any) => (
                                <li key={item.id} className="py-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="shrink-0 rounded-md bg-gray-100 p-1">
                                      <div className="size-10 rounded-md bg-gray-200"></div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium text-gray-900">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Qty: {item.quantity} × ₹{item.price}
                                      </p>
                                    </div>
                                    <div className="shrink-0">
                                      <span className="text-sm font-medium text-gray-900">
                                        ₹{item.quantity * item.price}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-900">Total</span>
                            <span className="text-sm font-medium text-gray-900">₹{order.total}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Addresses</h2>
                  <button className="flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Add New Address
                  </button>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`relative rounded-lg border ${
                        address.default ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                      } p-4 shadow-sm`}
                    >
                      {address.default && (
                        <span className="absolute right-2 top-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Default
                        </span>
                      )}
                      <div className="mb-2 flex items-center">
                        <div className="flex size-8 items-center justify-center rounded-full bg-gray-100">
                          <MapPin className="size-4 text-gray-600" />
                        </div>
                        <h3 className="ml-2 text-sm font-medium text-gray-900">{address.type}</h3>
                      </div>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p className="font-medium">{address.name}</p>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.pincode}</p>
                        <p className="flex items-center">
                          <Phone className="mr-1 size-3 text-gray-400" />
                          {address.phone}
                        </p>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button className="text-xs font-medium text-green-600 hover:text-green-700">
                          Edit
                        </button>
                        <button className="text-xs font-medium text-gray-600 hover:text-gray-700">
                          {address.default ? 'Remove Default' : 'Set as Default'}
                        </button>
                        <button className="text-xs font-medium text-red-600 hover:text-red-700">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Add New Address Card */}
                  <div className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center hover:border-green-500 hover:bg-green-50">
                    <div className="rounded-full bg-gray-100 p-3">
                      <MapPin className="size-6 text-gray-400" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Add a new address</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Save your shipping and billing addresses for faster checkout
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Wishlist</h2>
                  <Link 
                    href="/shop" 
                    className="text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
                <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-100">
                    <Heart className="size-8 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Save items you love to your wishlist and find them here anytime.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/shop"
                      className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Explore Plants
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {/* Payment Methods Tab */}
            {activeTab === 'payments' && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                  <button className="flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Add Payment Method
                  </button>
                </div>
                <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-100">
                    <CreditCard className="size-8 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No payment methods saved</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a payment method for faster checkout.
                  </p>
                  <div className="mt-6">
                    <button className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                      Add Payment Method
                    </button>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <div className="rounded-md bg-gray-100 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">Visa</span>
                    </div>
                    <div className="rounded-md bg-gray-100 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">Mastercard</span>
                    </div>
                    <div className="rounded-md bg-gray-100 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">American Express</span>
                    </div>
                    <div className="rounded-md bg-gray-100 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">UPI</span>
                    </div>
                    <div className="rounded-md bg-gray-100 px-3 py-2">
                      <span className="text-xs font-medium text-gray-600">Net Banking</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Decorative Footer */}
      <div className="mt-12 h-1 w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
    </div>
  );
}