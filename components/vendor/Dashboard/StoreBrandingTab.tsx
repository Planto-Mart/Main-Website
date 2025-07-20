import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';
import { Loader2, CheckCircle, AlertCircle, Upload, X, Globe, Building2, FileText, Shield, Phone, Mail, MapPin, CreditCard, Check, XCircle } from 'lucide-react';
import Image from 'next/image';

const initialBrandingState = {
  id: null as number | null,
  name: '',
  slug: '',
  description: '',
  banner_image: '',
  logo: '',
  image_gallery: [] as string[],
  about_us: '',
  features: [] as string[],
  contact_person_name: '',
  contact_email: '',
  contact_phone: '',
  business_name: '',
  business_address: '',
  business_registration_number: '',
  gstin_number: '',
  legal_structure: '',
  pan_number: '',
  return_policy: '',
  shipping_policy: '',
  privacy_policy: '',
  seller_terms: '',
};

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const StoreBrandingTab = () => {
  const [branding, setBranding] = useState({ ...initialBrandingState });
  const [original, setOriginal] = useState({ ...initialBrandingState });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'branding' | 'legal'>('branding');
  const [vendorDbId, setVendorDbId] = useState<number | null>(null);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Debounced slug validation
  useEffect(() => {
    if (!branding.slug || branding.slug === original.slug) {
      setSlugAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setSlugChecking(true);
      try {
        // Check if slug is available by trying to fetch a vendor with this slug
        const res = await fetch(`${API_ENDPOINTS.getAllVendorsPublic}?slug=${branding.slug}`);
        const data = await res.json();
        const slugExists = data.data?.some((vendor: any) => vendor.slug === branding.slug && vendor.id !== original.id);
        setSlugAvailable(!slugExists);
      } catch (err) {
        setSlugAvailable(false);
      } finally {
        setSlugChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [branding.slug, original.slug, original.id]);

  // Fetch vendor profile on mount
  useEffect(() => {
    const fetchBranding = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated.');
        const userId = session.user.id;
        const res = await fetch(API_ENDPOINTS.getVendorByUserUUID(userId), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch vendor profile');
        const json = await res.json();
        if (!json.success || !json.data) throw new Error(json.message || 'Vendor profile not found');
        
        const vendorData = {
          ...initialBrandingState,
          ...json.data,
          features: Array.isArray(json.data.features) ? json.data.features : 
                   (typeof json.data.features === 'string' ? JSON.parse(json.data.features || '[]') : []),
          image_gallery: Array.isArray(json.data.image_gallery) ? json.data.image_gallery : 
                        (typeof json.data.image_gallery === 'string' ? JSON.parse(json.data.image_gallery || '[]') : [])
        };
        
        setBranding(vendorData);
        setOriginal(vendorData);
        setVendorId(json.data.vendor_id);
        // Use the numeric database ID for updates - check if it exists in the response
        setVendorDbId((json.data as any).id || null);
        console.log('Vendor data received:', json.data);
        console.log('Vendor DB ID:', (json.data as any).id);
        console.log('Vendor ID:', json.data.vendor_id);
        setBannerPreview(json.data.banner_image || '');
        setLogoPreview(json.data.logo || '');
        // Handle gallery images from DB - they might be stored as JSON string
        const galleryImages = Array.isArray(json.data.image_gallery) ? json.data.image_gallery : 
                            (typeof json.data.image_gallery === 'string' ? JSON.parse(json.data.image_gallery || '[]') : []);
        setGalleryPreviews(galleryImages);
        console.log('Gallery images loaded:', galleryImages);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch vendor profile');
      } finally {
        setLoading(false);
      }
    };
    fetchBranding();
  }, []);

  // Handle input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // Special handling for slug to format it properly
    if (name === 'slug') {
      // Remove spaces, special characters, and convert to lowercase
      const formattedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // Only allow lowercase letters, numbers, and hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      setBranding((prev) => ({ ...prev, [name]: formattedSlug }));
    } else {
      setBranding((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle features array
  const handleFeatureChange = (index: number, value: string) => {
    setBranding((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };
  const addFeature = () => setBranding((prev) => ({ ...prev, features: [...prev.features, ''] }));
  const removeFeature = (index: number) => setBranding((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));

  // Handle image uploads
  const handleBannerUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setBranding((prev) => ({ ...prev, banner_image: base64 }));
    setBannerPreview(base64);
  };
  const handleLogoUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setBranding((prev) => ({ ...prev, logo: base64 }));
    setLogoPreview(base64);
  };
  const handleGalleryUpload = async (e: any) => {
    const files: File[] = Array.from(e.target.files);
    if (!files.length) return;
    const base64s = await Promise.all(files.map(toBase64));
    setBranding((prev) => ({ ...prev, image_gallery: [...prev.image_gallery, ...base64s] }));
    setGalleryPreviews((prev) => [...prev, ...base64s]);
  };
  const removeGalleryImage = (index: number) => {
    setBranding((prev) => ({ ...prev, image_gallery: prev.image_gallery.filter((_, i) => i !== index) }));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validate = () => {
    if (!branding.name.trim()) return 'Store name is required.';
    if (!branding.slug.trim()) return 'Store slug is required.';
    if (!branding.description.trim()) return 'Store description is required.';
    if (slugAvailable === false) return 'Store slug is not available.';
    return null;
  };

  // Check if anything changed
  const isChanged = JSON.stringify(branding) !== JSON.stringify(original);

  // Save handler
  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    // Try to use vendorDbId first, fallback to vendorId if needed
    const updateId = vendorDbId || vendorId;
    if (!updateId) {
      setError('Vendor ID missing.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      console.log('Saving branding data:', branding);
      console.log('Using vendor ID for update:', updateId);
      
      // Prepare data for backend - convert arrays to JSON strings if needed
      const dataToSend = {
        ...branding,
        features: Array.isArray(branding.features) ? JSON.stringify(branding.features) : branding.features,
        image_gallery: Array.isArray(branding.image_gallery) ? JSON.stringify(branding.image_gallery) : branding.image_gallery,
        updated_at: new Date().toISOString(),
        // Ensure null values are handled properly
        return_policy: branding.return_policy || '',
        shipping_policy: branding.shipping_policy || '',
        privacy_policy: branding.privacy_policy || '',
        seller_terms: branding.seller_terms || '',
        business_registration_number: branding.business_registration_number || '',
        gstin_number: branding.gstin_number || '',
        legal_structure: branding.legal_structure || '',
        pan_number: branding.pan_number || '',
        contact_person_name: branding.contact_person_name || '',
        contact_email: branding.contact_email || '',
        contact_phone: branding.contact_phone || '',
        business_name: branding.business_name || '',
        business_address: branding.business_address || '',
        about_us: branding.about_us || ''
      };
      
      console.log('Data being sent to backend:', dataToSend);
      
      const res = await fetch(API_ENDPOINTS.updateVendorById(updateId.toString()), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      const json = await res.json();
      console.log('Response JSON:', json);
      
      if (!res.ok) {
        console.error('HTTP Error:', res.status, res.statusText);
        throw new Error(json.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      if (!json.success) {
        console.error('API Error:', json.message);
        throw new Error(json.message || 'Failed to update branding');
      }
      
      setSuccess(true);
      setOriginal({ ...branding });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to update branding');
    } finally {
      setSaving(false);
    }
  };

  // Reset handler
  const handleReset = () => {
    setBranding({ ...original });
    setBannerPreview(original.banner_image || '');
    setLogoPreview(original.logo || '');
    setGalleryPreviews(Array.isArray(original.image_gallery) ? original.image_gallery : []);
    setError(null);
    setSuccess(false);
    setSlugAvailable(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        <span className="ml-4 text-green-700 font-medium">Loading store branding...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Store Branding</h2>
        <p className="text-gray-600">Manage your store's branding and business information</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 flex items-center rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">
          <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0" />
          <span>Store branding updated successfully!</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('branding')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'branding'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Globe className="inline mr-2 h-4 w-4" />
            Branding & Media
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'legal'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="inline mr-2 h-4 w-4" />
            Business & Legal
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'branding' && (
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="mr-2 h-5 w-5 text-green-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
                <input
                  type="text"
                  name="name"
                  value={branding.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Your Store Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Slug *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="slug"
                    value={branding.slug}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 pr-10 focus:ring-2 transition-colors ${
                      slugAvailable === true ? 'border-green-300 focus:border-green-500 focus:ring-green-200' :
                      slugAvailable === false ? 'border-red-300 focus:border-red-500 focus:ring-red-200' :
                      'border-gray-300 focus:border-green-500 focus:ring-green-200'
                    }`}
                    placeholder="your-store-slug (no spaces or special characters)"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {slugChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : slugAvailable === true ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : slugAvailable === false ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Only lowercase letters, numbers, and hyphens allowed</p>
                {slugAvailable === true && (
                  <p className="mt-1 text-sm text-green-600">✓ Slug is available</p>
                )}
                {slugAvailable === false && (
                  <p className="mt-1 text-sm text-red-600">✗ Slug is already taken</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Description *</label>
                <textarea
                  name="description"
                  value={branding.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Describe your store..."
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="mr-2 h-5 w-5 text-green-600" />
              Media & Images
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Banner Image</label>
                <div className="space-y-3">
                  {bannerPreview ? (
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                      <Image src={bannerPreview} alt="Banner" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => { setBannerPreview(''); setBranding((prev) => ({ ...prev, banner_image: '' })); }}
                        className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-lg hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p>No Banner Image</p>
                      </div>
                    </div>
                  )}
                  <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Banner
                  </button>
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Logo</label>
                <div className="space-y-3">
                  {logoPreview ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border mx-auto">
                      <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => { setLogoPreview(''); setBranding((prev) => ({ ...prev, logo: '' })); }}
                        className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-lg hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 w-32 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 mx-auto">
                      <div className="text-center">
                        <Upload className="mx-auto h-6 w-6 mb-1" />
                        <p className="text-xs">No Logo</p>
                      </div>
                    </div>
                  )}
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </button>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Image Gallery</label>
              <p className="text-xs text-gray-500 mb-3">Images from database and newly uploaded images</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {galleryPreviews.map((img, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border">
                    <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute right-1 top-1 rounded-full bg-white p-1 shadow hover:bg-gray-50"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Upload className="h-6 w-6" />
                </button>
              </div>
              {galleryPreviews.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">No gallery images yet. Click the upload button to add images.</p>
              )}
            </div>
          </div>

          {/* About & Features */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-green-600" />
              About & Features
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Us</label>
                <textarea
                  name="about_us"
                  value={branding.about_us}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Tell customers about your store..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Store Features</label>
                <p className="text-xs text-gray-500 mb-3">Add, edit, or remove store features</p>
                <div className="space-y-2">
                  {(branding.features || []).map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={e => handleFeatureChange(idx, e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                        placeholder={`Feature ${idx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-lg bg-green-100 px-4 py-2 text-green-700 hover:bg-green-200 transition-colors"
                  >
                    + Add Feature
                  </button>
                </div>
                {branding.features.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">No features added yet. Click "Add Feature" to get started.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'legal' && (
        <div className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="mr-2 h-5 w-5 text-green-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  name="contact_person_name"
                  value={branding.contact_person_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Contact Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contact_email"
                  value={branding.contact_email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="text"
                  name="contact_phone"
                  value={branding.contact_phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-green-600" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  name="business_name"
                  value={branding.business_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Business Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                <input
                  type="text"
                  name="business_address"
                  value={branding.business_address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Business Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  name="business_registration_number"
                  value={branding.business_registration_number}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Registration Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Structure</label>
                <input
                  type="text"
                  name="legal_structure"
                  value={branding.legal_structure}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Proprietorship/LLP/Company"
                />
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-green-600" />
              Tax & Legal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN Number</label>
                <input
                  type="text"
                  name="gstin_number"
                  value={branding.gstin_number}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                <input
                  type="text"
                  name="pan_number"
                  value={branding.pan_number}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-600" />
              Policies & Terms
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy</label>
                <textarea
                  name="return_policy"
                  value={branding.return_policy}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Describe your return policy..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Policy</label>
                <textarea
                  name="shipping_policy"
                  value={branding.shipping_policy}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Describe your shipping policy..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy</label>
                <textarea
                  name="privacy_policy"
                  value={branding.privacy_policy}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Describe your privacy policy..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seller Terms</label>
                <textarea
                  name="seller_terms"
                  value={branding.seller_terms}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  placeholder="Describe your seller terms..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !isChanged || slugAvailable === false}
          className="flex-1 sm:flex-none rounded-lg bg-green-600 px-8 py-3 text-white font-medium shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving || !isChanged}
          className="flex-1 sm:flex-none rounded-lg bg-gray-200 px-8 py-3 text-gray-700 font-medium shadow hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Reset Changes
        </button>
      </div>
    </div>
  );
};

export default StoreBrandingTab; 