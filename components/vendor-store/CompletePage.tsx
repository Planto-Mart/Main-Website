"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../Navbar';
import { API_ENDPOINTS } from '@/config/api';

interface VendorData {
  id: number;
  vendor_id: string;
  slug: string;
  name: string;
  description: string;
  banner_image: string;
  logo: string;
  image_gallery: string;
  rating: number;
  about_us: string;
  features: string;
  business_name: string;
  business_address: string;
  contact_person_name: string;
  contact_email: string;
  contact_phone: string;
  return_policy: string;
  shipping_policy: string;
  privacy_policy: string;
  seller_terms: string;
  is_verified: number;
  status: string;
  created_at: string;
  updated_at: string;
}

function CompletePage({ slug }: { slug: string }) {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_ENDPOINTS.getVendorBySlug(slug));
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch vendor data');
        }
        
        setVendorData(result.data);
      } catch (err: any) {
        console.error('Error fetching vendor data:', err);
        setError(err.message || 'Failed to load vendor information');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchVendorData();
    }
  }, [slug]);

  // Parse image gallery if it exists
  const imageGallery = vendorData?.image_gallery ? 
    (typeof vendorData.image_gallery === 'string' ? JSON.parse(vendorData.image_gallery) : vendorData.image_gallery) : 
    [];

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-green-50 to-emerald-100 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-700 font-medium">Loading store information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vendorData) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-red-50 to-pink-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Store Not Found</h3>
              <p className="text-gray-600">{error || 'This store does not exist or is no longer available.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Banner Section */}
      <div className="relative h-screen min-h-[600px] overflow-hidden">
        {vendorData.banner_image ? (
          <Image
            src={vendorData.banner_image}
            alt={`${vendorData.name} store banner`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 animate-gradient"></div>
        )}
        
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-teal-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Content - Store Information */}
                <div className="text-white space-y-8">
                  {/* Store Badge */}
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 animate-fade-in">
                    {vendorData.is_verified && (
                      <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        VERIFIED STORE
                      </div>
                    )}
                    <span className="text-white/80 text-sm font-medium">Premium Plant Store</span>
                  </div>

                  {/* Store Name */}
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight animate-slide-up">
                      <span className="bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent">
                        {vendorData.name}
                      </span>
                    </h1>
                    
                    {vendorData.business_name && vendorData.business_name !== vendorData.name && (
                      <p className="text-xl md:text-2xl text-green-200 font-medium animate-slide-up delay-200">
                        {vendorData.business_name}
                      </p>
                    )}
                  </div>
                  
                  {/* Description */}
                  {vendorData.description && (
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl animate-slide-up delay-300">
                      {vendorData.description}
                    </p>
                  )}
                  
                  {/* Stats & Rating */}
                  <div className="flex flex-wrap items-center gap-6 animate-slide-up delay-400">
                    {vendorData.rating && (
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(vendorData.rating) ? 'text-yellow-400' : 'text-white/30'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-white font-bold text-lg">{vendorData.rating}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                      <div className={`w-3 h-3 rounded-full ${vendorData.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                      <span className="text-white font-semibold capitalize">{vendorData.status}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-4 animate-slide-up delay-500">
                    <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
                      Explore Store
                    </button>
                    <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20">
                      Contact Us
                    </button>
                  </div>
                </div>

                {/* Right Content - Logo & Visual Elements */}
                <div className="relative flex justify-center lg:justify-end">
                  {/* Main Logo Container */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white transform hover:scale-105 transition-transform duration-500">
                      {vendorData.logo ? (
                        <Image
                          src={vendorData.logo}
                          alt={`${vendorData.name} logo`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 via-emerald-200 to-teal-300 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-20 h-20 md:w-24 md:h-24 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                            </svg>
                            <p className="text-green-700 font-bold text-lg">{vendorData.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Floating Elements Around Logo */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Background Decorative Elements */}
                  <div className="absolute top-10 -left-10 w-20 h-20 bg-emerald-400/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-10 -right-10 w-16 h-16 bg-green-400/30 rounded-full blur-xl animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      {imageGallery.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Store Gallery</h2>
              
              {/* Main Image Display */}
              <div className="relative h-96 md:h-[500px] mb-6 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageGallery[activeImageIndex]}
                  alt={`${vendorData.name} gallery image ${activeImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {imageGallery.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-24 md:h-32 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === activeImageIndex 
                        ? 'ring-4 ring-green-500 scale-105' 
                        : 'hover:scale-105 hover:ring-2 ring-green-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${vendorData.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About & Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* About Us */}
              {vendorData.about_us && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">About {vendorData.name}</h2>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Our Story</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">{vendorData.about_us}</p>
                  </div>
                </div>
              )}

              {/* Business Information */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Business Information</h2>
                <div className="space-y-4">
                  
                  {/* Business Details */}
                  {vendorData.business_name && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-4a2 2 0 00-2-2H6z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-semibold text-gray-900">Business Name</h3>
                      </div>
                      <p className="text-gray-700">{vendorData.business_name}</p>
                    </div>
                  )}

                  {/* Location */}
                  {vendorData.business_address && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-semibold text-gray-900">Location</h3>
                      </div>
                      <p className="text-gray-700">{vendorData.business_address}</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <h3 className="font-semibold text-gray-900">Contact Information</h3>
                    </div>
                    <div className="space-y-2">
                      {vendorData.contact_email && (
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {vendorData.contact_email}
                        </p>
                      )}
                      {vendorData.contact_phone && (
                        <p className="text-gray-700">
                          <span className="font-medium">Phone:</span> {vendorData.contact_phone}
                        </p>
                      )}
                      {vendorData.contact_person_name && (
                        <p className="text-gray-700">
                          <span className="font-medium">Contact Person:</span> {vendorData.contact_person_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      {(vendorData.return_policy || vendorData.shipping_policy || vendorData.privacy_policy || vendorData.seller_terms) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Store Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {vendorData.return_policy && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Return Policy
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{vendorData.return_policy}</p>
                  </div>
                )}

                {vendorData.shipping_policy && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                      </svg>
                      Shipping Policy
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{vendorData.shipping_policy}</p>
                  </div>
                )}

                {vendorData.privacy_policy && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Privacy Policy
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{vendorData.privacy_policy}</p>
                  </div>
                )}

                {vendorData.seller_terms && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Seller Terms
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{vendorData.seller_terms}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default CompletePage;
