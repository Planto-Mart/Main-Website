/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
"use client";
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Star, 
  Settings, 
  Users, 
  LogOut,
  Store,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/utils/supabase/client';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  vendorData: any;
  isMenuOpen?: boolean;
  onClose?: () => void;
}

function Sidebar({ activeTab, setActiveTab, vendorData, isMenuOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768
      ) {
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 flex h-full w-72 max-w-[85vw] flex-col overflow-hidden bg-white shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:border-r md:border-gray-200 md:shadow-none ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
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
            type='button'
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>
        {/* Vendor Profile */}
        <div className="flex flex-col items-center border-b border-gray-200 p-4">
          <div className="relative size-16 overflow-hidden rounded-full">
            {vendorData?.avatar_url ? (
              <Image 
                src={vendorData.avatar_url} 
                alt="Vendor Avatar" 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-green-100 text-xl font-medium text-green-700">
                {vendorData?.full_name?.charAt(0) || vendorData?.email?.charAt(0) || 'V'}
              </div>
            )}
          </div>
          <h2 className="mt-2 max-w-full truncate text-center text-sm font-medium text-gray-900">
            {vendorData?.vendor_details?.store_name || 'Your Store'}
          </h2>
          <p className="max-w-full truncate text-center text-xs text-gray-500">{vendorData?.email}</p>
          <div className="mt-2 flex items-center rounded-full bg-green-100 px-2 py-1">
            <Store className="mr-1 size-3 text-green-700" />
            <span className="text-xs font-medium text-green-700">Vendor</span>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1.5">
            <button
              type='button'
              onClick={() => handleTabChange('overview')}
              className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="mr-3 size-5 shrink-0" />
              <span className="truncate">Overview</span>
            </button>
            <button
              type='button'
              onClick={() => handleTabChange('products')}
              className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Package className="mr-3 size-5 shrink-0" />
              <span className="truncate">Products</span>
            </button>
            <button
              type='button'
              onClick={() => handleTabChange('orders')}
              className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ShoppingBag className="mr-3 size-5 shrink-0" />
              <span className="truncate">Orders</span>
            </button>
            <button
              type='button'
              onClick={() => handleTabChange('reviews')}
              className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Star className="mr-3 size-5 shrink-0" />
              <span className="truncate">Reviews</span>
            </button>
            <button
              type='button'
              onClick={() => handleTabChange('customers')}
              className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'customers'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users className="mr-3 size-5 shrink-0" />
              <span className="truncate">Customers</span>
            </button>
            <button
              type='button'
              onClick={() => handleTabChange('settings')}
              className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings className="mr-3 size-5 shrink-0" />
              <span className="truncate">Settings</span>
            </button>
            {/* Store Branding Tab */}
            <button
              type='button'
              onClick={() => handleTabChange('storeBranding')}
              className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'storeBranding'
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">🌿</span>
              <span className="truncate">Store Branding</span>
            </button>
          </div>
        </nav>
        {/* Sign Out Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            type='button'
            onClick={handleSignOut}
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100"
          >
            <LogOut className="mr-2 size-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;