/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Minus, 
  ImageIcon, 
  Package, 
  Tag, 
  DollarSign, 
  FileText,
  Star,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Camera,
  Info
} from 'lucide-react';
import Image from 'next/image';

// Mock Supabase client - Replace with your actual Supabase client
const supabase = {
  from: (table) => ({
    insert: async (data) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Inserting data:', data);
      
      // Simulate random success/error for demo
      if (Math.random() > 0.1) {
        return { data: { ...data, product_id: Math.random().toString(36).substr(2, 9) }, error: null };
      } else {
        return { data: null, error: { message: 'Failed to insert product' } };
      }
    }
  }),
  storage: {
    from: (bucket) => ({
      upload: async (path, file) => {
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
          data: { path: `https://example.com/storage/${path}` }, 
          error: null 
        };
      }
    })
  }
};

const ProductListingModal = ({ isOpen, onClose, vendorID }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    aboutInBullets: [''],
    image_gallery: [],
    price: '',
    brand: '',
    quantity: '',
    discountPercent: '',
    variants: [''],
    variantState: false,
    featured: false
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});

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
    'Soil & Compost'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayInputChange = (index, value, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (index, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index:any) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Product title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = 'Valid quantity is required';
    if (imageFiles.length === 0) newErrors.images = 'At least one product image is required';
    
    // Validate bullets
    const validBullets = formData.aboutInBullets.filter(bullet => bullet.trim());
    if (validBullets.length === 0) newErrors.aboutInBullets = 'At least one product feature is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImages = async () => {
    const uploadPromises = imageFiles.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      
      if (error) throw error;
      return data.path;
    });
    
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Upload images first
      const imagePaths = await uploadImages();
      
      // Generate slug from title
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Calculate discount price
      const discountPrice = formData.discountPercent 
        ? parseFloat(formData.price) - (parseFloat(formData.price) * parseFloat(formData.discountPercent) / 100)
        : null;
      
      // Prepare product data
      const productData = {
        slug,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        aboutInBullets: formData.aboutInBullets.filter(bullet => bullet.trim()),
        image_gallery: imagePaths,
        price: parseFloat(formData.price),
        brand: formData.brand.trim(),
        vendorID: vendorID,
        rating: 0,
        reviewNumbers: 0,
        reviews: [],
        quantity: parseInt(formData.quantity),
        discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : null,
        discountPrice: discountPrice,
        variants: formData.variantState ? formData.variants.filter(variant => variant.trim()) : null,
        variantState: formData.variantState,
        featured: formData.featured,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('products_dev')
        .insert([productData]);
      
      if (error) throw error;
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting product:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      aboutInBullets: [''],
      image_gallery: [],
      price: '',
      brand: '',
      quantity: '',
      discountPercent: '',
      variants: [''],
      variantState: false,
      featured: false
    });
    setImageFiles([]);
    setErrors({});
    setCurrentStep(1);
    setSubmitStatus(null);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate basic info before proceeding
      const basicErrors = {};
      if (!formData.title.trim()) basicErrors.title = 'Product title is required';
      if (!formData.description.trim()) basicErrors.description = 'Description is required';
      if (!formData.category) basicErrors.category = 'Category is required';
      
      if (Object.keys(basicErrors).length > 0) {
        setErrors(basicErrors);
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <p className="text-green-100 mt-1">Step {currentStep} of 3</p>
            </div>
            <button
              type='button'
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white bg-opacity-20 h-2 rounded-full">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-green-100">
              <span>Basic Info</span>
              <span>Images & Features</span>
              <span>Pricing & Inventory</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your product in detail..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter brand name"
                />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Images & Features */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images * (Max 5 images)
                </label>
                {/** biome-ignore lint/a11y/noStaticElementInteractions: will look into while refactoring */}
                {/** biome-ignore lint/a11y/useKeyWithClickEvents: will look into while refactoring */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors ${
                    errors.images ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload product images</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB each</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}

                {/* Image Preview */}
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                    {imageFiles.map((file, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: not needed here
                    <div key={index} className="relative group">
                        <Image
                          width={200}
                          height={200}
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Features *
                </label>
                {formData.aboutInBullets.map((bullet, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: not needed here
                <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'aboutInBullets')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.aboutInBullets.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeArrayItem(index, 'aboutInBullets')}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type='button'
                  onClick={() => addArrayItem('aboutInBullets')}
                  className="text-green-600 hover:text-green-700 flex items-center space-x-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feature</span>
                </button>
                {errors.aboutInBullets && <p className="text-red-500 text-sm mt-1">{errors.aboutInBullets}</p>}
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    name="variantState"
                    checked={formData.variantState}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    This product has variants (sizes, colors, etc.)
                  </label>
                </div>
                
                {formData.variantState && (
                  <div className="ml-6 space-y-2">
                    {formData.variants.map((variant, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: not needed here
                    <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={variant}
                          onChange={(e) => handleArrayInputChange(index, e.target.value, 'variants')}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={`Variant ${index + 1} (e.g., Small, Medium, Large)`}
                        />
                        {formData.variants.length > 1 && (
                          <button
                          type='button'
                            onClick={() => removeArrayItem(index, 'variants')}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                    type='button'
                      onClick={() => addArrayItem('variants')}
                      className="text-green-600 hover:text-green-700 flex items-center space-x-1 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Variant</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Inventory */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price * ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity in Stock *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Mark as featured product
                </label>
                <div className="relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Featured products appear in special sections
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {formData.price && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-800 mb-2">Price Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Original Price:</span>
                      <span>${parseFloat(formData.price || 0).toFixed(2)}</span>
                    </div>
                    {formData.discountPercent && (
                      <>
                        <div className="flex justify-between text-red-600">
                          <span>Discount ({formData.discountPercent}%):</span>
                          <span>-${(parseFloat(formData.price || 0) * parseFloat(formData.discountPercent || 0) / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-green-600 pt-1 border-t border-green-200">
                          <span>Final Price:</span>
                          <span>${(parseFloat(formData.price || 0) - (parseFloat(formData.price || 0) * parseFloat(formData.discountPercent || 0) / 100)).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Status */}
          {submitStatus && (
            <div className={`mt-6 p-4 rounded-lg flex items-center space-x-2 ${
              submitStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {submitStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>
                {submitStatus === 'success' 
                  ? 'Product added successfully!' 
                  : 'Failed to add product. Please try again.'
                }
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
              type='button'
                onClick={prevStep}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
            type='button'
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            
            {currentStep < 3 ? (
              <button
              type='button'
                onClick={nextStep}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
              type='button'
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Adding Product...' : 'Add Product'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingModal;