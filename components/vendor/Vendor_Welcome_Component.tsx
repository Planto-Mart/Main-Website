/* eslint-disable import/no-unresolved */
import Link from 'next/link'
import {useEffect, useState} from 'react'
import { Loader2, ShoppingBag, TrendingUp, CreditCard, Shield } from 'lucide-react';
import Image from 'next/image';

import { supabase } from '@/utils/supabase/client';

function Vendor_Welcome_Component() {
      const [becomingVendor, setBecomingVendor] = useState(false);
      const [user, setUser] = useState<any>(null);
    
    // Fetch user data from Supabase
    // biome-ignore lint/correctness/useExhaustiveDependencies: will look  into this later
    useEffect(()=>{
        const fetchUser = async () => {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            console.error('Error fetching user:', error);
            
            return;
          }
          setUser(data.user);
        };
    
        fetchUser();
      },[user]);

    // Handle becoming a vendor (first step)
      const handleBecomeVendor = async () => {
        if (!user) return;
        
        setBecomingVendor(true);
        
        try {
          // Update user profile to set is_vendor to true
          const { error } = await supabase
            .from('profiles_dev')
            .update({
              is_vendor: true,
              updated_at: new Date().toISOString()
            })
            .eq('uuid', user.id);
          
          if (error) {
            throw error;
          }
          
          // Update local state
          setBecomingVendor(true);
        } catch (error: any) {
          console.error('Error becoming a vendor:', error);
          alert('Failed to register as vendor. Please try again.');
        } finally {
          setBecomingVendor(false);
        }
      };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
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
      <div className="mb-10 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Why Sell on PlantoMart?</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Benefit 1 */}
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
          {/* Benefit 2 */}
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
          {/* Benefit 3 */}
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
          {/* Benefit 4 */}
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
        {/* Pricing Info */}
        <div className="mt-8 rounded-lg bg-green-50 p-4">
          <h3 className="mb-2 text-center text-lg font-semibold text-gray-800">Seller Fees</h3>
          <p className="text-center text-gray-600">
            PlantoMart charges only 5% commission on each sale. No hidden fees, no monthly charges.
          </p>
        </div>
        {/* CTA Button */}
        <div className="mt-8 text-center">
          <button
            type='button'
            onClick={handleBecomeVendor}
            disabled={becomingVendor}
            className="inline-block rounded-md bg-green-600 px-8 py-3 text-center text-lg font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {becomingVendor ? (
              <>
                <Loader2 className="mr-2 inline size-5 animate-spin" />
                Processing...
              </>
                  ) : (
                    'Register as Vendor'
                  )}
          </button>
          <p className="mt-3 text-sm text-gray-500">
            By registering, you agree to our <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
          </p>
        </div>
      </div>
      {/* Testimonials or FAQ section could be added here */}
    </div>
  )
}

export default Vendor_Welcome_Component
