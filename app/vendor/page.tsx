"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { 
  Leaf, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Search, 
  Filter, 
  Grid, 
  List,
  Shield,
  ShoppingBag,
  Award,
  Clock,
  Building2,
  Verified
} from 'lucide-react';
import Navbar from '@/components/Navbar';

// Vendor type definition based on API response
interface Vendor {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  banner_image: string | null;
  logo: string | null;
  image_gallery: string[] | null;
  rating: number;
  about_us: string | null;
  features: string[] | null;
  business_name: string;
  business_address: string;
  contact_person_name: string;
  contact_email: string;
  contact_phone: string;
  return_policy: string | null;
  shipping_policy: string | null;
  privacy_policy: string | null;
  seller_terms: string | null;
  is_verified: number;
  status: string;
}

// API Response interface
interface VendorApiResponse {
  success: boolean;
  message: string;
  data: Vendor[];
}


interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const defaultLogo = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop';
  const defaultBanner = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=300&fit=crop';

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-100">
      {/* Banner Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={vendor.banner_image || defaultBanner}
          alt={`${vendor.business_name} banner`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(vendor.status)}`}>
            {vendor.status}
          </span>
        </div>

        {/* Verification Badge */}
        {vendor.is_verified === 1 && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Verified className="h-3 w-3" />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Vendor Info */}
      <div className="p-6">
        {/* Logo and Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-emerald-100 flex-shrink-0">
            <Image
              src={vendor.logo || defaultLogo}
              alt={`${vendor.business_name} logo`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/vendor/${vendor.slug}`} className="block group">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                {vendor.business_name}
              </h3>
            </Link>
            <p className="text-emerald-600 font-medium text-sm">{vendor.name}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {vendor.description || vendor.about_us || "Dedicated to bringing you the finest plants and gardening supplies with exceptional service and care."}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(vendor.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {vendor.rating > 0 ? vendor.rating.toFixed(1) : '4.0'} rating
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
            <span className="truncate">{vendor.business_address}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <User className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
            <span className="truncate">{vendor.contact_person_name}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Phone className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
            <span className="truncate">{vendor.contact_phone}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link 
            href={`/vendor/${vendor.slug}`}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 px-4 rounded-full font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group"
          >
            <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>View Store</span>
          </Link>
          <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-full font-medium transition-colors duration-200">
            <Mail className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const VendorListItem: React.FC<VendorCardProps> = ({ vendor }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const defaultLogo = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop';
  const defaultBanner = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=300&fit=crop';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-emerald-100">
      <div className="flex flex-col md:flex-row">
        {/* Banner Section */}
        <div className="relative md:w-80 h-48 overflow-hidden">
          <Image
            src={vendor.banner_image || defaultBanner}
            alt={`${vendor.business_name} banner`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          
          {/* Logo Overlay */}
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={vendor.logo || defaultLogo}
              alt={`${vendor.business_name} logo`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(vendor.status)}`}>
              {vendor.status}
            </span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link href={`/vendor/${vendor.slug}`} className="block group">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {vendor.business_name}
                  </h3>
                </Link>
                <p className="text-emerald-600 font-medium">{vendor.name}</p>
              </div>
              
              {vendor.is_verified === 1 && (
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">
              {vendor.description || vendor.about_us || "Dedicated to bringing you the finest plants and gardening supplies with exceptional service and care."}
            </p>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(vendor.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {vendor.rating > 0 ? vendor.rating.toFixed(1) : '4.0'} rating
              </span>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="truncate">{vendor.business_address}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <User className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="truncate">{vendor.contact_person_name}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="truncate">{vendor.contact_phone}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="truncate">{vendor.contact_email}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link 
              href={`/vendor/store/${vendor.slug}`}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 px-6 rounded-full font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Visit Store</span>
            </Link>
            <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-3 rounded-full font-medium transition-colors duration-200">
              <Mail className="h-5 w-5" />
            </button>
            <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-3 rounded-full font-medium transition-colors duration-200">
              <Phone className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VendorPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://backend-server.developer-plantomart.workers.dev/vendor/get-all-vendors');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vendors: ${response.status}`);
      }
      
      const data: VendorApiResponse = await response.json();
      console.log('API Response:', data);
      
      setVendors(data.data || []);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedVendors = vendors
    .filter(vendor => {
      const matchesSearch = 
        vendor.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.business_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact_person_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'verified':
          return (b.is_verified || 0) - (a.is_verified || 0);
        case 'location':
          return a.business_address.localeCompare(b.business_address);
        case 'name':
        default:
          return a.business_name.localeCompare(b.business_name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-emerald-700 text-lg font-medium">Loading our amazing vendors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Building2 className="h-12 w-12 text-emerald-200" />
              <h1 className="text-5xl md:text-6xl font-bold">Our Vendors</h1>
            </div>
            <p className="text-xl md:text-2xl font-light text-emerald-100 mb-8 max-w-3xl mx-auto">
              Discover Trusted Plant Partners Bringing Nature to Your Doorstep
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-emerald-100">🌱 Trusted Sellers • 🏆 Quality Assured • 🚚 Reliable Delivery</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-emerald-50 to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600">{vendors.length}</div>
              <div className="text-gray-600">Total Vendors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{vendors.filter(v => v.is_verified === 1).length}</div>
              <div className="text-gray-600">Verified Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{vendors.filter(v => v.status === 'active').length}</div>
              <div className="text-gray-600">Active Stores</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">{vendors.filter(v => v.rating > 4).length}</div>
              <div className="text-gray-600">Top Rated</div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            
            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-emerald-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-emerald-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-emerald-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Highest Rated</option>
                  <option value="verified">Verified First</option>
                  <option value="location">By Location</option>
                </select>
              </div>
              
              {/* View Mode */}
              <div className="flex items-center bg-emerald-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-200'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-200'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-red-600">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold">Unable to fetch vendors</h3>
                <p className="text-red-600 text-sm mt-1">
                  {error}. Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vendors Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Trusted Plant Vendors
            </h2>
            <p className="text-gray-600">
              {filteredAndSortedVendors.length} amazing vendors ready to serve you
            </p>
          </div>
        </div>

        {/* Vendors Grid/List */}
        {filteredAndSortedVendors.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              : "space-y-6"
          }>
            {filteredAndSortedVendors.map((vendor) =>
              viewMode === 'grid' ? (
                <VendorCard key={vendor.id} vendor={vendor} />
              ) : (
                <VendorListItem key={vendor.id} vendor={vendor} />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <Building2 className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-600">
                {searchTerm ? 
                  `No vendors match "${searchTerm}". Try a different search term.` :
                  'No vendors available at the moment.'
                }
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Why Become a Vendor Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Sell with PlantoMart?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our thriving community of plant vendors and reach thousands of plant enthusiasts looking for quality products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Reach More Customers</h4>
              <p className="text-gray-600">Connect with thousands of plant lovers actively searching for quality plants and gardening supplies.</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Trusted Platform</h4>
              <p className="text-gray-600">Benefit from our verification system and build trust with customers through our secure marketplace.</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Easy Management</h4>
              <p className="text-gray-600">Simple tools to manage your inventory, orders, and customer relationships all in one place.</p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/vendor/register"
              className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200 space-x-2 group"
            >
              <Building2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span>Become a Vendor</span>
            </Link>
          </div>
        </div>

        {/* Featured Vendors Section */}
        {vendors.filter(v => v.is_verified === 1).length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified Vendors</h3>
              <p className="text-gray-600">Our trusted and verified plant partners</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.filter(v => v.is_verified === 1).slice(0, 6).map((vendor) => (
                <div key={vendor.id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={vendor.logo || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop'}
                        alt={`${vendor.business_name} logo`}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/vendor/${vendor.slug}`} className="block group">
                        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {vendor.business_name}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-600">{vendor.business_address}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Verified className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}