"use client";
import { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Loader2, CheckCircle, AlertCircle, ShoppingBag, TrendingUp, 
  CreditCard, Shield, Store 
} from 'lucide-react';

import SignIn from '@/components/auth/Sign-in';
import { supabase } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';
import Vendor_Welcome_Component from '@/components/vendor/Vendor_Welcome_Component';
import VendorRegister from '@/components/vendor/VendorRegister';

// Interface for vendor data structure
interface VendorData {
  user_uuid: string;
  user_id: string;
  vendor_id: string;
  store_name: string;
  store_description: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst_number: string;
  pan_number: string;
  bank_details: {
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    account_holder_name: string;
  };
  vendor_approval_status: string;
  is_registered: boolean;
  registration_date: string;
}

export default function VendorRegisterPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [vendorStatus, setVendorStatus] = useState<'loading' | 'not_vendor' | 'is_vendor' | 'registering' | 'error'>('loading');
  const [vendorError, setVendorError] = useState<string | null>(null);

  const router = useRouter();
  const element_unique_id = useId();

  const toggleSignIn = () => {
    setIsSignInOpen(!isSignInOpen);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsSignInOpen(true);
        setLoading(false);
        return;
      }

      setUser(session.user);

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

      const profileData = profileJson.data;
      setProfile(profileData);

      // Check vendor status using backend API
      await checkVendorStatus(session.user.id);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setVendorStatus('error');
      setVendorError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const checkVendorStatus = async (userId: string) => {
    try {
      setVendorStatus('loading');
      setVendorError(null);

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
      const foundVendor = vendorJson.data.find((v: VendorData) =>
        v.user_uuid === userId ||
        v.user_id === userId ||
        v.vendor_id === userId
      );

      setVendorStatus(foundVendor ? 'is_vendor' : 'not_vendor');

    } catch (err: any) {
      setVendorStatus('error');
      setVendorError(err.message || 'Could not check vendor status');
    }
  };

  useEffect(() => {
    fetchUserData();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setIsSignInOpen(false);
          await fetchUserData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setVendorStatus('loading');
          setIsSignInOpen(true);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-12 animate-spin text-green-600" />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 pb-12 pt-8">
      {/* Sign In Modal */}
      {isSignInOpen && (
        <>
          <SignIn isOpen={isSignInOpen} onClose={toggleSignIn} redirectUrl='/vendor/register' />
          <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
        </>
      )}

      <div className="container mx-auto px-4">
        {/* Vendor Status Check */}
        {vendorStatus === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="mb-4 size-12 animate-spin text-green-600" />
            <span className="text-gray-600 font-medium">Checking vendor status...</span>
          </div>
        )}

        {vendorStatus === 'error' && (
          <div className="mx-auto max-w-2xl rounded-lg bg-red-50 border border-red-200 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-red-800">Error Loading Data</h1>
            <p className="text-red-700 mb-6">{vendorError}</p>
            <button
              onClick={fetchUserData}
              className="rounded bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* If user is already a vendor */}
        {vendorStatus === 'is_vendor' && (
          <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <div className="text-center">
              <Store className="mx-auto mb-4 size-16 text-green-500" />
              <h1 className="mb-2 text-2xl font-bold text-gray-900">You're already a registered vendor!</h1>
              <p className="mb-6 text-gray-600">
                Your vendor account is set up and ready. Access your vendor dashboard to manage your store.
              </p>
              <Link 
                href="/vendor/dashboard" 
                className="inline-block rounded-md bg-green-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-green-700"
              >
                Go to Vendor Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Vendor registration content */}
        {vendorStatus === 'not_vendor' && (
          <div className="mx-auto max-w-4xl">
            {/* Welcome Section */}
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative size-20">
                  <Image 
                    src="/assets/logo_Without_Text.png" 
                    alt="Plantomart Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h1 className="mb-3 text-3xl font-bold text-gray-900">Become a Vendor on PlantoMart</h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Join our growing community of plant sellers and reach customers across India. 
                Start your own plant business today!
              </p>
            </div>

            {/* Benefits Section */}
            <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Why Sell on PlantoMart?</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex">
                  <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <ShoppingBag className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Reach More Customers</h3>
                    <p className="text-gray-600">
                      Connect with plant enthusiasts across India. Our platform brings your products to thousands of potential customers.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <TrendingUp className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Grow Your Business</h3>
                    <p className="text-gray-600">
                      Leverage our marketing tools and analytics to scale your plant business and increase sales.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CreditCard className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Secure Payments</h3>
                    <p className="text-gray-600">
                      Receive payments directly to your bank account with our secure payment processing system.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Shield className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Seller Protection</h3>
                    <p className="text-gray-600">
                      Our seller-friendly policies ensure your business is protected while you focus on what you do best.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 rounded-lg bg-green-50 p-4">
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-800">Seller Fees</h3>
                <p className="text-center text-gray-600">
                  PlantoMart charges only 5% commission on each sale. No hidden fees, no monthly charges.
                </p>
              </div>
              
              {/* CTA Button to start registration */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVendorStatus('registering')}
                  className="inline-block rounded-md bg-green-600 px-8 py-3 text-center text-lg font-medium text-white transition-colors hover:bg-green-700"
                >
                  Register as Vendor
                </button>
                <p className="mt-3 text-sm text-gray-500">
                  By registering, you agree to our <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Registration Component */}
        {vendorStatus === 'registering' && (
          <div className="w-full flex flex-col items-center">
            <VendorRegister 
              userUUID={user?.id}
              userEmail={user?.email}
              userName={profile?.full_name}
              onRegistrationSuccess={() => {
                setVendorStatus('is_vendor');
                // Refresh vendor status after successful registration
                setTimeout(() => {
                  setVendorStatus('loading');
                  // Re-check vendor status
                  fetchUserData();
                }, 2000);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}