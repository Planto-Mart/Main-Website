/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
"use client";
import { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// biome-ignore lint/correctness/noUnusedImports: might be needed later
import { Loader2, CheckCircle, AlertCircle, ShoppingBag, TrendingUp, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';

import SignIn from '@/components/auth/Sign-in';
import { supabase } from '@/utils/supabase/client';
import Vendor_Welcome_Component from '@/components/vendor/Vendor_Welcome_Component';

export default function VendorRegisterPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [isVendorRegistered, setIsVendorRegistered] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  // biome-ignore lint/correctness/noUnusedVariables: will look into this during refactoring
  const [becomingVendor, setBecomingVendor] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();
  const element_unique_id = useId();

  // Check authentication status on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setShowSignIn(true);
          setLoading(false);
          
return;
        }
        
        setUser(session.user);
        
        // Check if user is already a vendor
        const { data: profileData, error: profileError } = await supabase
          .from('profiles_dev')
          .select('is_vendor, vendor_details')
          .eq('uuid', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setLoading(false);
          
return;
        }
        
        setIsVendor(profileData?.is_vendor || false);
        setIsVendorRegistered(profileData?.vendor_details?.is_registered || false);
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setShowSignIn(false);
          
          // Check vendor status when user signs in
          const { data: profileData, error: profileError } = await supabase
            .from('profiles_dev')
            .select('is_vendor, vendor_details')
            .eq('uuid', session.user.id)
            .single();
          
          if (!profileError) {
            setIsVendor(profileData?.is_vendor || false);
            setIsVendorRegistered(profileData?.vendor_details?.is_registered || false);
          }
          
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsVendor(false);
          setIsVendorRegistered(false);
          setShowSignIn(true);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Handle becoming a vendor (first step)
  const _handleBecomeVendor = async () => {
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
      setIsVendor(true);
    } catch (error: any) {
      console.error('Error becoming a vendor:', error);
      alert('Failed to register as vendor. Please try again.');
    } finally {
      setBecomingVendor(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.storeName.trim()) errors.storeName = 'Store name is required';
    if (!formData.storeDescription.trim()) errors.storeDescription = 'Store description is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pincode.trim()) errors.pincode = 'Pincode is required';
    if (!formData.gstNumber.trim()) errors.gstNumber = 'GST number is required';
    if (!formData.panNumber.trim()) errors.panNumber = 'PAN number is required';
    if (!formData.bankName.trim()) errors.bankName = 'Bank name is required';
    if (!formData.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    if (!formData.ifscCode.trim()) errors.ifscCode = 'IFSC code is required';
    if (!formData.accountHolderName.trim()) errors.accountHolderName = 'Account holder name is required';
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';
    
    setFormErrors(errors);
    
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Update user profile with vendor details
      const { error } = await supabase
        .from('profiles_dev')
        .update({
          updated_at: new Date().toISOString(),
          vendor_details: {
            store_name: formData.storeName,
            store_description: formData.storeDescription,
            phone_number: formData.phoneNumber,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            gst_number: formData.gstNumber,
            pan_number: formData.panNumber,
            bank_details: {
              bank_name: formData.bankName,
              account_number: formData.accountNumber,
              ifsc_code: formData.ifscCode,
              account_holder_name: formData.accountHolderName
            },
        },
        registration_date: new Date().toISOString(),
        is_registered: true,
        vendor_approval_status: 'pending'
        })
        .eq('uuid', user.id);
      
      if (error) {
        throw error;
      }
      
      setSubmitSuccess(true);
      setIsVendorRegistered(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/vendor/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting vendor registration:', error);
      setSubmitError(error.message || 'Failed to submit registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 pb-12 pt-8">
      {/* Sign In Modal (cannot be closed if not authenticated) */}
      {showSignIn && (
        <>
          <SignIn 
            isOpen={showSignIn} 
            onClose={() => user && setShowSignIn(false)} 
            redirectUrl="/vendor/register"
          />
          {/* Blur overlay */}
          <div className="fixed inset-0 backdrop-blur-sm"></div>
        </>
      )}
      <div className="container mx-auto px-4">
        {/* If user is already a vendor and registered */}
        {isVendor && isVendorRegistered ? (
          <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 size-16 text-green-500" />
              <h1 className="mb-2 text-2xl font-bold text-gray-900">You`re already registered as a vendor!</h1>
              <p className="mb-6 text-gray-600">
                Your vendor account is already set up. You can now access your vendor dashboard to manage your store.
              </p>
              <Link 
                href="/vendor/dashboard" 
                className="inline-block rounded-md bg-green-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-green-700"
              >
                Go to Vendor Dashboard
              </Link>
            </div>
          </div>
        ) : !isVendor ? (
          // Vendor landing page - shown when is_vendor is false
          <Vendor_Welcome_Component/>
        //   <div className="mx-auto max-w-4xl">
        //     {/* Header */}
        //     <div className="mb-8 text-center">
        //       <div className="mb-4 flex justify-center">
        //         <div className="relative size-20">
        //           <Image 
        //             src="/assets/logo_Without_Text.png" 
        //             alt="Plantomart Logo"
        //             fill
        //             className="object-contain"
        //             priority
        //           />
        //         </div>
        //       </div>
        //       <h1 className="mb-3 text-3xl font-bold text-gray-900">Become a Vendor on PlantoMart</h1>
        //       <p className="mx-auto max-w-2xl text-lg text-gray-600">
        //         Join our growing community of plant sellers and reach customers across India. 
        //         Start your own plant business today!
        //       </p>
        //     </div>
        //     {/* Benefits Section */}
        //     <div className="mb-10 rounded-xl bg-white p-8 shadow-lg">
        //       <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Why Sell on PlantoMart?</h2>
        //       <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        //         {/* Benefit 1 */}
        //         <div className="flex">
        //           <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100">
        //             <ShoppingBag className="size-6 text-green-600" />
        //           </div>
        //           <div>
        //             <h3 className="mb-2 text-lg font-semibold text-gray-800">Reach More Customers</h3>
        //             <p className="text-gray-600">
        //               Connect with plant enthusiasts across India. Our platform brings your products to thousands of potential customers.
        //             </p>
        //           </div>
        //         </div>
        //         {/* Benefit 2 */}
        //         <div className="flex">
        //           <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100">
        //             <TrendingUp className="size-6 text-green-600" />
        //           </div>
        //           <div>
        //             <h3 className="mb-2 text-lg font-semibold text-gray-800">Grow Your Business</h3>
        //             <p className="text-gray-600">
        //               Leverage our marketing tools and analytics to scale your plant business and increase sales.
        //             </p>
        //           </div>
        //         </div>
        //         {/* Benefit 3 */}
        //         <div className="flex">
        //           <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100">
        //             <CreditCard className="size-6 text-green-600" />
        //           </div>
        //           <div>
        //             <h3 className="mb-2 text-lg font-semibold text-gray-800">Secure Payments</h3>
        //             <p className="text-gray-600">
        //               Receive payments directly to your bank account with our secure payment processing system.
        //             </p>
        //           </div>
        //         </div>
        //         {/* Benefit 4 */}
        //         <div className="flex">
        //           <div className="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100">
        //             <Shield className="size-6 text-green-600" />
        //           </div>
        //           <div>
        //             <h3 className="mb-2 text-lg font-semibold text-gray-800">Seller Protection</h3>
        //             <p className="text-gray-600">
        //               Our seller-friendly policies ensure your business is protected while you focus on what you do best.
        //             </p>
        //           </div>
        //         </div>
        //       </div>
        //       {/* Pricing Info */}
        //       <div className="mt-8 rounded-lg bg-green-50 p-4">
        //         <h3 className="mb-2 text-center text-lg font-semibold text-gray-800">Seller Fees</h3>
        //         <p className="text-center text-gray-600">
        //           PlantoMart charges only 5% commission on each sale. No hidden fees, no monthly charges.
        //         </p>
        //       </div>
        //       {/* CTA Button */}
        //       <div className="mt-8 text-center">
        //         <button
        //           onClick={handleBecomeVendor}
        //           disabled={becomingVendor}
        //           className="inline-block rounded-md bg-green-600 px-8 py-3 text-center text-lg font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        //         >
        //           {becomingVendor ? (
        //             <>
        //               <Loader2 className="mr-2 inline size-5 animate-spin" />
        //               Processing...
        //             </>
        //           ) : (
        //             'Register as Vendor'
        //           )}
        //         </button>
        //         <p className="mt-3 text-sm text-gray-500">
        //           By registering, you agree to our <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
        //         </p>
        //       </div>
        //     </div>
        //     {/* Testimonials or FAQ section could be added here */}
        //   </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative size-16">
                  <Image 
                    src="/assets/logo_Without_Text.png" 
                    alt="Plantomart Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">Complete Your Vendor Registration</h1>
              <p className="text-gray-600">
                Please provide your business details to complete the registration process
              </p>
            </div>
            {/* Success Message */}
            {submitSuccess ? (
              <div className="rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                  <CheckCircle className="mx-auto mb-4 size-16 text-green-500" />
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">Registration Successful!</h2>
                  <p className="mb-6 text-gray-600">
                    Your vendor application has been submitted successfully. We'll review your details and get back to you soon.
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting you to the vendor dashboard...
                  </p>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
                {submitError && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircle className="mr-3 size-5 text-red-500" />
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  </div>
                )}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Store Information</h2>
                </div>
                {/* Store Name */}
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    id={element_unique_id}
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border text-black ${
                      formErrors.storeName ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                    placeholder="Your store name"
                  />
                  {formErrors.storeName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.storeName}</p>
                  )}
                </div>
                {/* Rest of the form fields remain unchanged */}
                {/* ... existing form fields ... */}
                
                {/* Store Description */}
                <div>
                  <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">
                    Store Description *
                  </label>
                  <textarea
                    id={element_unique_id}
                    name="storeDescription"
                    rows={3}
                    value={formData.storeDescription}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border text-black ${
                      formErrors.storeDescription ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                    placeholder="Describe your store and what you sell"
                  />
                  {formErrors.storeDescription && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.storeDescription}</p>
                  )}
                </div>
                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Business Phone Number *
                  </label>
                  <input
                    type="tel"
                    id={element_unique_id}
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border text-black ${
                      formErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                    placeholder="+91 9876543210"
                  />
                  {formErrors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.phoneNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.address ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="Street address"
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.address}</p>
                    )}
                  </div>
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.city ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="City"
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.state ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="State"
                    />
                    {formErrors.state && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.state}</p>
                    )}
                  </div>
                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.pincode ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="Pincode"
                    />
                    {formErrors.pincode && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.pincode}</p>
                    )}
                  </div>
                </div>
                <div className="border-b border-gray-200 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">Business Information</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* GST Number */}
                  <div>
                    <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                      GST Number *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.gstNumber ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="GST Number"
                    />
                    {formErrors.gstNumber && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.gstNumber}</p>
                    )}
                  </div>
                  {/* PAN Number */}
                  <div>
                    <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.panNumber ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="PAN Number"
                    />
                    {formErrors.panNumber && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.panNumber}</p>
                    )}
                  </div>
                </div>
                <div className="border-b border-gray-200 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">Bank Details</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Bank Name */}
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.bankName ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="Bank Name"
                    />
                    {formErrors.bankName && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.bankName}</p>
                    )}
                  </div>
                  {/* Account Number */}
                  <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.accountNumber ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="Account Number"
                    />
                    {formErrors.accountNumber && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.accountNumber}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* IFSC Code */}
                  <div>
                    <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.ifscCode ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="IFSC Code"
                    />
                    {formErrors.ifscCode && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.ifscCode}</p>
                    )}
                  </div>
                  {/* Account Holder Name */}
                  <div>
                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border text-black ${
                        formErrors.accountHolderName ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm`}
                      placeholder="Account Holder Name"
                    />
                    {formErrors.accountHolderName && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.accountHolderName}</p>
                    )}
                  </div>
                </div>
                {/* Terms and Conditions */}
                <div className="mt-4">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={element_unique_id}
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className={`size-4 rounded border-gray-300 text-green-600 focus:ring-green-500 ${
                          formErrors.agreeToTerms ? 'border-red-300' : ''
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                        I agree to the terms and conditions *
                      </label>
                      <p className="text-xs text-gray-500">
                        By checking this box, you agree to our{' '}
                        <Link href="/terms" className="text-green-600 hover:text-green-500">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-green-600 hover:text-green-500">
                          Privacy Policy
                        </Link>
                      </p>
                      {formErrors.agreeToTerms && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.agreeToTerms}</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full justify-center rounded-md bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">
                  <p>
                    Your information will be reviewed by our team. You'll receive a confirmation email once approved.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}