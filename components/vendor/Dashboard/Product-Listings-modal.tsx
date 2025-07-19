/** biome-ignore-all lint/a11y/noLabelWithoutControl: will look in future */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: will see while refactoring */
/** biome-ignore-all lint/correctness/noUnusedImports: will look in future */
import { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, CheckCircle, AlertCircle, Camera, Info } from 'lucide-react';
import Image from 'next/image';
import { API_ENDPOINTS } from '@/config/api';
import { supabase } from '@/utils/supabase/client';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const categories = [
  'Indoor Plants',
  'Outdoor Plants',
  'Succulents',
  'Flowering Plants',
  'Herbs',
  'Trees',
  'Seeds',
  'Plant Care',
  'Pots & Planters',
  'Garden Tools',
  'Fertilizers',
  'Soil & Compost',
];

const ProductListingModal = ({ isOpen, onClose, onProductCreated }: {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    about_in_bullets: [''],
    image_gallery: [] as string[],
    price: '',
    brand: '',
    quantity: '',
    discount_percent: '',
    variants: [''],
    variantState: false,
    featured: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageBase64s, setImageBase64s] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [vendorIdLoading, setVendorIdLoading] = useState(false);
  const [vendorIdError, setVendorIdError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Fetch vendorId on open
    const fetchVendorId = async () => {
      setVendorIdLoading(true);
      setVendorIdError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setVendorIdError('Not authenticated. Please sign in again.');
          setVendorId(null);
          setVendorIdLoading(false);
          return;
        }
        const userId = session.user.id;
        const res = await fetch(API_ENDPOINTS.getAllVendorsAdmin, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch vendor profiles');
        const vendorJson = await res.json();
        if (!vendorJson.success || !Array.isArray(vendorJson.data)) throw new Error(vendorJson.message || 'Vendor data error');
        const found = vendorJson.data.find((v: any) =>
          v.user_uuid === userId ||
          v.user_id === userId ||
          v.vendor_id === userId
        );
        if (!found) {
          setVendorIdError('Vendor profile not found. Please register as a vendor.');
          setVendorId(null);
        } else {
          setVendorId(found.vendor_id || found.user_uuid || found.user_id);
        }
      } catch (err: any) {
        setVendorIdError(err.message || 'Failed to fetch vendor ID.');
        setVendorId(null);
      } finally {
        setVendorIdLoading(false);
      }
    };
    fetchVendorId();
  }, [isOpen]);

  // Handle input changes
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle array field changes
  const handleArrayChange = (index: number, value: string, field: 'about_in_bullets' | 'variants') => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };
  const addArrayItem = (field: 'about_in_bullets' | 'variants') => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };
  const removeArrayItem = (index: number, field: 'about_in_bullets' | 'variants') => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  // Image handling (convert to base64)
  const handleImageUpload = async (e: any) => {
    const files: File[] = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      setErrors((prev) => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }
    setErrors((prev) => ({ ...prev, images: '' }));
    setLoading(true);
    try {
      const newBase64s = await Promise.all(files.map(file => toBase64(file)));
      setImageFiles((prev) => [...prev, ...files]);
      setImageBase64s((prev) => [...prev, ...newBase64s]);
    } catch (err) {
      setErrors((prev) => ({ ...prev, images: 'Failed to process images.' }));
    } finally {
      setLoading(false);
    }
  };
  // Helper to convert file to base64
  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImageBase64s((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title.trim()) newErrors.title = 'Product title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Valid price is required';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    if (!form.quantity || parseInt(form.quantity) < 0) newErrors.quantity = 'Valid quantity is required';
    if (imageBase64s.length === 0) newErrors.images = 'At least one product image is required';
    if (form.about_in_bullets.filter((b) => b.trim()).length === 0) newErrors.about_in_bullets = 'At least one product feature is required';
    if (!vendorId) newErrors.vendorId = 'Vendor ID is missing. Please refresh.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    console.log('Add Product clicked', { vendorId, form });
    if (!validate()) {
      setStatus('error');
      setApiError('Please fix the errors above and try again.');
      alert('Please fix the errors above and try again.');
      return;
    }
    if (!vendorId) {
      setErrors((prev) => ({ ...prev, vendorId: vendorIdError || 'Vendor ID is missing. Please refresh.' }));
      setStatus('error');
      setApiError(vendorIdError || 'Vendor ID is missing. Please refresh.');
      alert(vendorIdError || 'Vendor ID is missing. Please refresh.');
      return;
    }
    setLoading(true);
    setApiError(null);
    setStatus(null);
    try {
      // Use base64 strings for image_gallery
      const image_gallery = imageBase64s;
      const slug = slugify(form.title);
      const product_id = crypto.randomUUID();
      const payload: any = {
        product_id,
        slug,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        about_in_bullets: form.about_in_bullets.filter((b) => b.trim()),
        image_gallery,
        price: parseFloat(form.price),
        brand: form.brand.trim(),
        vendorID: vendorId,
        raiting: 0,
        reviewNumbers: 0,
        reviews: [],
        quantity: parseInt(form.quantity),
        discount_percent: form.discount_percent ? parseFloat(form.discount_percent) : null,
        discountPrice: form.discount_percent ? (parseFloat(form.price) - (parseFloat(form.price) * parseFloat(form.discount_percent) / 100)) : null,
        variants: form.variantState ? form.variants.filter((v) => v.trim()) : null,
        variantState: form.variantState,
        featured: form.featured,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('Submitting payload:', payload);
      // API call
      const res = await fetch(API_ENDPOINTS.createProduct, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatus('error');
        setApiError(json.message || 'Failed to add product.');
        alert(json.message || 'Failed to add product.');
        return;
      }
      setStatus('success');
      setTimeout(() => {
        setForm({
          title: '', description: '', category: '', about_in_bullets: [''], image_gallery: [], price: '', brand: '', quantity: '', discount_percent: '', variants: [''], variantState: false, featured: false
        });
        setImageFiles([]);
        setImageBase64s([]);
        setErrors({});
        setStep(1);
        setStatus(null);
        setApiError(null);
        onClose();
        onProductCreated();
      }, 1200);
    } catch (err: any) {
      setStatus('error');
      setApiError(err.message || 'Failed to add product.');
      alert(err.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  // Step navigation
  const nextStep = () => {
    if (step === 1) {
      const basicErrors: { [key: string]: string } = {};
      if (!form.title.trim()) basicErrors.title = 'Product title is required';
      if (!form.description.trim()) basicErrors.description = 'Description is required';
      if (!form.category) basicErrors.category = 'Category is required';
      if (Object.keys(basicErrors).length > 0) {
        setErrors(basicErrors);
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-100/80 to-emerald-200/90 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[95vh] flex flex-col border-2 border-green-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="inline-block"><Image src="/assets/logo_Without_Text.png" alt="logo" width={32} height={32} /></span>
                Add New Product
              </h2>
              <p className="text-green-100 mt-1">Step {step} of 3</p>
            </div>
            <button aria-label="Close modal" type="button" onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white bg-opacity-20 h-2 rounded-full">
              <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs sm:text-sm text-green-100">
              <span>Basic Info</span>
              <span>Images & Features</span>
              <span>Pricing & Inventory</span>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32 plant-scrollbar">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter product title" />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'}`}> <option value="">Select category</option> {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))} </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Describe your product in detail..." />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                <input type="text" name="brand" value={form.brand} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.brand ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter brand name" />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
              </div>
            </div>
          )}
          {/* Step 2: Images & Features */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images * (Max 5 images)</label>
                <div className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-green-500 transition-colors ${errors.images ? 'border-red-500' : 'border-gray-300'}`} onClick={() => fileInputRef.current?.click()}>
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload product images</p>
                  <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, JPEG up to 5MB each</p>
                  <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                {loading && (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                  </div>
                )}
                {/* Image Preview */}
                {imageBase64s.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                    {imageBase64s.map((base64, index) => (
                      <div key={index} className="relative group">
                        <Image width={200} height={200} src={base64} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button aria-label="Remove image" type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Product Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Features *</label>
                {form.about_in_bullets.map((bullet, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" value={bullet} onChange={(e) => handleArrayChange(index, e.target.value, 'about_in_bullets')} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder={`Feature ${index + 1}`} />
                    {form.about_in_bullets.length > 1 && (
                      <button aria-label="Remove feature" type="button" onClick={() => removeArrayItem(index, 'about_in_bullets')} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
                <button aria-label="Add feature" type="button" onClick={() => addArrayItem('about_in_bullets')} className="text-green-600 hover:text-green-700 flex items-center space-x-1 text-sm mt-2"><Plus className="w-4 h-4" /><span>Add Feature</span></button>
                {errors.about_in_bullets && <p className="text-red-500 text-sm mt-1">{errors.about_in_bullets}</p>}
              </div>
              {/* Variants */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" name="variantState" checked={form.variantState} onChange={handleChange} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                  <label className="text-sm font-medium text-gray-700">This product has variants (sizes, colors, etc.)</label>
                </div>
                {form.variantState && (
                  <div className="ml-6 space-y-2">
                    {form.variants.map((variant, index) => (
                      <div key={index} className="flex gap-2">
                        <input type="text" value={variant} onChange={(e) => handleArrayChange(index, e.target.value, 'variants')} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder={`Variant ${index + 1} (e.g., Small, Medium, Large)`} />
                        {form.variants.length > 1 && (
                          <button aria-label="Remove variant" type="button" onClick={() => removeArrayItem(index, 'variants')} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                    <button aria-label="Add variant" type="button" onClick={() => addArrayItem('variants')} className="text-green-600 hover:text-green-700 flex items-center space-x-1 text-sm mt-2"><Plus className="w-4 h-4" /><span>Add Variant</span></button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Step 3: Pricing & Inventory */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price * (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'}`} placeholder="0.00" />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
                  <input type="number" name="discount_percent" value={form.discount_percent} onChange={handleChange} min="0" max="100" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity in Stock *</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="0" className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                <label className="text-sm font-medium text-gray-700">Mark as featured product</label>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Featured products appear in special sections</div>
                </div>
              </div>
              {/* Price Summary */}
              {form.price && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-800 mb-2">Price Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Original Price:</span><span>₹{parseFloat(form.price || '0').toFixed(2)}</span></div>
                    {form.discount_percent && (
                      <>
                        <div className="flex justify-between text-red-600"><span>Discount ({form.discount_percent}%):</span><span>-₹{(parseFloat(form.price || '0') * parseFloat(form.discount_percent || '0') / 100).toFixed(2)}</span></div>
                        <div className="flex justify-between font-medium text-green-600 pt-1 border-t border-green-200"><span>Final Price:</span><span>₹{(parseFloat(form.price || '0') - (parseFloat(form.price || '0') * parseFloat(form.discount_percent || '0') / 100)).toFixed(2)}</span></div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Submit Status & Errors */}
          {vendorIdLoading && (
            <div className="mt-6 p-4 rounded-lg flex items-center space-x-2 bg-yellow-50 text-yellow-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading vendor profile...</span>
            </div>
          )}
          {vendorIdError && (
            <div className="mt-6 p-4 rounded-lg flex items-center space-x-2 bg-red-50 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{vendorIdError}</span>
            </div>
          )}
          {errors.vendorId && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{errors.vendorId}</div>}
          {status === 'error' && apiError && (
            <div className="mt-6 p-4 rounded-lg flex items-center space-x-2 bg-red-50 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{apiError}</span>
            </div>
          )}
        </div>
        {/* Sticky Footer */}
        <div className="sticky bottom-0 left-0 right-0 bg-gray-50 px-4 sm:px-6 py-4 flex justify-between items-center shadow-[0_-2px_8px_-2px_rgba(16,64,16,0.08)] z-10">
          <div className="flex space-x-3">{step > 1 && (<button aria-label="Previous step" type="button" onClick={prevStep} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Previous</button>)}</div>
          <div className="flex space-x-3">
            <button aria-label="Cancel" type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
            {step < 3 ? (
              <button aria-label="Next step" type="button" onClick={nextStep} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">Next</button>
            ) : (
              <button aria-label="Add product" type="button" onClick={handleSubmit} disabled={loading || vendorIdLoading || !vendorId} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">{loading ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<CheckCircle className="w-4 h-4" />)}<span>{loading ? 'Adding Product...' : 'Add Product'}</span></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingModal;