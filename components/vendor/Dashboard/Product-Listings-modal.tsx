/** biome-ignore-all lint/a11y/noLabelWithoutControl: will look in future */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: will see while refactoring */
/** biome-ignore-all lint/correctness/noUnusedImports: will look in future */
import { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, CheckCircle, AlertCircle, Camera, Info, Building2, Edit, Save, Package } from 'lucide-react';
import Image from 'next/image';
import { API_ENDPOINTS } from '@/config/api';
import { supabase } from '@/utils/supabase/client';
import ProductDataType from '@/types/ProductData';
import { ProductVariantType } from '@/types/ProductData';

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

const variantTypes = [
  'Size',
  'Color',
  'Material',
  'Style',
  'Type',
  'Variety',
  'Model',
  'Edition'
];

interface ProductListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: () => void;
  onProductUpdated?: () => void;
  productToEdit?: ProductDataType | null;
  mode?: 'create' | 'edit';
}

// Extend ProductDataType locally to allow product_variants for edit mode
interface ProductDataTypeWithVariants extends ProductDataType {
  product_variants?: any[];
}

const ProductListingModal = ({ 
  isOpen, 
  onClose, 
  onProductCreated, 
  onProductUpdated,
  productToEdit = null,
  mode = 'create'
}: ProductListingModalProps) => {
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

  // NEW: Enhanced variant management
  const [variants, setVariants] = useState<Array<{
    variant_name: string;
    variant_type: string;
    price: string;
    quantity: string;
    discount_percent: string;
    description: string;
    image_gallery: string[];
    variant_id?: string; // Added for existing variants
  }>>([]);

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
  const [vendorBrandInfo, setVendorBrandInfo] = useState<any>(null);
  const [brandInfoLoading, setBrandInfoLoading] = useState(false);
  const [formErrorSummary, setFormErrorSummary] = useState<string[]>([]);
  const firstErrorRef = useRef<HTMLInputElement | null>(null);
  const [variantDeleteLoading, setVariantDeleteLoading] = useState<string | null>(null);
  const variantFileInputRefs = useRef<{ [key: string]: HTMLInputElement }>({});

  // Initialize form with product data when editing
  useEffect(() => {
    if (isOpen && mode === 'edit' && productToEdit) {
      const product = productToEdit as ProductDataTypeWithVariants;
      setForm({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        about_in_bullets: product.about_in_bullets && Array.isArray(product.about_in_bullets) 
          ? product.about_in_bullets 
          : [''],
        image_gallery: product.image_gallery && Array.isArray(product.image_gallery) 
          ? product.image_gallery 
          : [],
        price: product.price?.toString() || '',
        brand: product.brand || '',
        quantity: product.quantity?.toString() || '',
        discount_percent: product.discountPercent?.toString() || '',
        variants: product.variants && Array.isArray(product.variants) 
          ? product.variants 
          : [''],
        variantState: product.variantState || false,
        featured: product.featured || false,
      });
      setImageBase64s(product.image_gallery && Array.isArray(product.image_gallery) 
        ? product.image_gallery 
        : []);
      // Improved: Pre-fill variants from product_variants if present, else fallback to legacy variants
      if (product.variantState && Array.isArray(product.product_variants) && product.product_variants.length > 0) {
        setVariants(product.product_variants.map((v: any) => ({
          variant_name: v.variant_name || '',
          variant_type: v.variant_type || 'Size',
          price: v.price?.toString() || '',
          quantity: v.quantity?.toString() || '',
          discount_percent: v.discount_percent?.toString() || '',
          description: v.description || '',
          image_gallery: v.image_gallery || [],
          variant_id: v.variant_id, // Add variant_id
        })));
      } else if (product.variantState && Array.isArray(product.variants) && product.variants.length > 0 && typeof product.variants[0] === 'object') {
        // Fallback: If legacy variants is an array of objects (rare)
        setVariants(product.variants.map((v: any) => ({
          variant_name: v.variant_name || '',
          variant_type: v.variant_type || 'Size',
          price: v.price?.toString() || '',
          quantity: v.quantity?.toString() || '',
          discount_percent: v.discount_percent?.toString() || '',
          description: v.description || '',
          image_gallery: v.image_gallery || [],
          variant_id: v.variant_id, // Add variant_id
        })));
      } else {
        setVariants([]);
      }
    } else if (isOpen && mode === 'create') {
      // Reset form for new product
      setForm({
        title: '',
        description: '',
        category: '',
        about_in_bullets: [''],
        image_gallery: [],
        price: '',
        brand: '',
        quantity: '',
        discount_percent: '',
        variants: [''],
        variantState: false,
        featured: false,
      });
      setImageBase64s([]);
      setImageFiles([]);
      setVariants([]);
    }
    setStep(1);
    setErrors({});
    setStatus(null);
    setApiError(null);
    setFormErrorSummary([]);
  }, [isOpen, mode, productToEdit]);

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
          // Fetch vendor brand information
          await fetchVendorBrandInfo(userId);
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

  // Fetch vendor brand information
  const fetchVendorBrandInfo = async (userId: string) => {
    setBrandInfoLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.getVendorByUserUUID(userId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch vendor brand info');
      const json = await res.json();
      if (!json.success || !json.data) throw new Error(json.message || 'Vendor brand info not found');
      
      setVendorBrandInfo(json.data);
      // Auto-fill brand field with vendor's business name only for new products
      if (mode === 'create') {
        setForm(prev => ({
          ...prev,
          brand: json.data.business_name || json.data.name || ''
        }));
      }
    } catch (err: any) {
      console.error('Failed to fetch vendor brand info:', err);
      // Don't show error to user, just log it
    } finally {
      setBrandInfoLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (index: number, value: string, field: 'about_in_bullets' | 'variants') => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'about_in_bullets' | 'variants') => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'about_in_bullets' | 'variants') => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // NEW: Variant management functions
  const addVariant = () => {
    setVariants(prev => [...prev, {
      variant_name: '',
      variant_type: 'Size',
      price: '',
      quantity: '',
      discount_percent: '',
      description: '',
      image_gallery: []
    }]);
  };

  const removeVariant = async (index: number) => {
    const variant = variants[index];
    if (variant.variant_id) {
      setVariantDeleteLoading(variant.variant_id);
      try {
        const res = await fetch(API_ENDPOINTS.deleteProductVariant(variant.variant_id), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          alert('Failed to delete variant: ' + (json.message || 'Unknown error'));
          setVariantDeleteLoading(null);
          return;
        }
      } catch (err) {
        alert('Error deleting variant.');
        setVariantDeleteLoading(null);
        return;
      }
      setVariantDeleteLoading(null);
    }
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string | string[]) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  const handleImageUpload = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (files.length === 0) return;

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    try {
      const base64Promises = files.map(file => toBase64(file));
      const base64Results = await Promise.all(base64Promises);
      setImageBase64s(prev => [...prev, ...base64Results]);
      setForm(prev => ({
        ...prev,
        image_gallery: [...prev.image_gallery, ...base64Results]
      }));
    } catch (error) {
      console.error('Error converting images to base64:', error);
    }
  };

  const handleVariantImageUpload = async (index: number, e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (files.length === 0) return;

    try {
      const base64Promises = files.map(file => toBase64(file));
      const base64Results = await Promise.all(base64Promises);
      
      setVariants(prev => prev.map((variant, i) => {
        if (i === index) {
          const currentImages = variant.image_gallery || [];
          return {
            ...variant,
            image_gallery: [...currentImages, ...base64Results]
          };
        }
        return variant;
      }));
    } catch (error) {
      console.error('Error converting variant images to base64:', error);
    }
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    setVariants(prev => prev.map((variant, i) => {
      if (i === variantIndex && variant.image_gallery) {
        return {
          ...variant,
          image_gallery: variant.image_gallery.filter((_, imgI) => imgI !== imageIndex)
        };
      }
      return variant;
    }));
  };

  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageBase64s(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({
      ...prev,
      image_gallery: prev.image_gallery.filter((_, i) => i !== index)
    }));
  };

  const normalizeVariantGallery = (gallery: any): string[] => {
    if (!gallery) return [];
    if (typeof gallery === 'string') {
      try {
        const parsed = JSON.parse(gallery);
        if (Array.isArray(parsed)) return parsed;
        return [gallery];
      } catch {
        return [gallery];
      }
    }
    if (Array.isArray(gallery)) return gallery;
    return [];
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const errorSummary: string[] = [];

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
      errorSummary.push('Title is required');
    }
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
      errorSummary.push('Description is required');
    }
    if (!form.category) {
      newErrors.category = 'Category is required';
      errorSummary.push('Category is required');
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = 'Valid price is required';
      errorSummary.push('Valid price is required');
    }
    if (!form.brand.trim()) {
      newErrors.brand = 'Brand is required';
      errorSummary.push('Brand is required');
    }
    if (!form.quantity || parseInt(form.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
      errorSummary.push('Valid quantity is required');
    }
    if (form.image_gallery.length === 0) {
      newErrors.image_gallery = 'At least one image is required';
      errorSummary.push('At least one image is required');
    }
    if (form.about_in_bullets.length === 0 || form.about_in_bullets.every(bullet => !bullet.trim())) {
      newErrors.about_in_bullets = 'At least one bullet point is required';
      errorSummary.push('At least one bullet point is required');
    }

    // Validate variants if variantState is true
    if (form.variantState && variants.length === 0) {
      newErrors.variants = 'At least one variant is required when variants are enabled';
      errorSummary.push('At least one variant is required when variants are enabled');
    }

    if (form.variantState) {
      variants.forEach((variant, index) => {
        if (!variant.variant_name || !variant.variant_name.trim()) {
          newErrors[`variant_${index}_name`] = 'Variant name is required';
          errorSummary.push(`Variant ${index + 1}: Name is required`);
        }
        if (!variant.price || parseFloat(variant.price) <= 0) {
          newErrors[`variant_${index}_price`] = 'Valid variant price is required';
          errorSummary.push(`Variant ${index + 1}: Valid price is required`);
        }
        if (!variant.quantity || parseInt(variant.quantity) < 0) {
          newErrors[`variant_${index}_quantity`] = 'Valid variant quantity is required';
          errorSummary.push(`Variant ${index + 1}: Valid quantity is required`);
        }
        if (!variant.variant_type || !variant.variant_type.trim()) {
          newErrors[`variant_${index}_type`] = 'Variant type is required';
          errorSummary.push(`Variant ${index + 1}: Type is required`);
        }
        
        // Optional: Require at least one image per variant
        if (!variant.image_gallery || variant.image_gallery.length === 0) {
          newErrors[`variant_${index}_images`] = 'At least one image is required for each variant';
          errorSummary.push(`Variant ${index + 1}: At least one image is required`);
        }
      });
    }

    setErrors(newErrors);
    setFormErrorSummary(errorSummary);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      // Scroll to first error field if possible
      setTimeout(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
          const el = document.querySelector(`[name="${firstErrorKey}"]`);
          if (el && 'scrollIntoView' in el) {
            (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus?.();
          }
        }
      }, 100);
      return;
    }

    setLoading(true);
    setStatus(null);
    setApiError(null);

    try {
      const productId = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const slug = slugify(form.title);

      if (mode === 'create') {
        // Create new product
        const payload: any = {
          product_id: productId,
          slug,
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          about_in_bullets: form.about_in_bullets.filter((b) => b.trim()),
          image_gallery: form.image_gallery,
          price: parseFloat(form.price),
          brand: form.brand.trim(),
          vendorID: vendorId,
          raiting: 0,
          reviewNumbers: 0,
          quantity: parseInt(form.quantity),
          discount_percent: form.discount_percent ? parseFloat(form.discount_percent) : null,
          discountPrice: form.discount_percent ? (parseFloat(form.price) - (parseFloat(form.price) * parseFloat(form.discount_percent) / 100)) : null,
          variants: form.variantState ? variants : null, // Use variants state (array of objects)
          variantState: form.variantState,
          featured: form.featured,
        };

        console.log('Creating product with payload:', payload);
        const res = await fetch(API_ENDPOINTS.createProduct, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          setStatus('error');
          setApiError(json.message || 'Failed to create product.');
          return;
        }

        // Create variants if variantState is true
        if (form.variantState && variants.length > 0) {
          console.log('Creating variants:', variants);
          let variantCreationSuccess = true;
          
          for (const variant of variants) {
            try {
              const variantPayload = {
                parent_product_id: productId,
                variant_name: variant.variant_name.trim(),
                variant_type: variant.variant_type || 'size', // Default to size if not specified
                price: parseFloat(variant.price),
                quantity: parseInt(variant.quantity),
                discount_percent: variant.discount_percent ? parseFloat(variant.discount_percent) : null,
                image_gallery: variant.image_gallery && variant.image_gallery.length > 0 ? variant.image_gallery : null,
                description: variant.description ? variant.description.trim() : null,
              };

              console.log('Creating variant with payload:', variantPayload);
              const variantRes = await fetch(API_ENDPOINTS.createProductVariant, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(variantPayload),
              });

              const variantJson = await variantRes.json();
              if (!variantRes.ok) {
                console.error('Failed to create variant:', variant.variant_name, variantJson);
                variantCreationSuccess = false;
                setApiError(`Failed to create variant: ${variant.variant_name} - ${variantJson.message}`);
              } else {
                console.log('Variant created successfully:', variantJson);
              }
            } catch (error) {
              console.error('Error creating variant:', variant.variant_name, error);
              variantCreationSuccess = false;
              setApiError(`Error creating variant: ${variant.variant_name}`);
            }
          }
          
          if (!variantCreationSuccess) {
            setStatus('error');
            return;
          }
        }

        setStatus('success');
        setTimeout(() => {
          onClose();
          onProductCreated();
        }, 1200);
      } else {
        // Update existing product
        const payload: any = {
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          about_in_bullets: form.about_in_bullets.filter((b) => b.trim()),
          image_gallery: form.image_gallery,
          price: parseFloat(form.price),
          brand: form.brand.trim(),
          quantity: parseInt(form.quantity),
          discount_percent: form.discount_percent ? parseFloat(form.discount_percent) : null,
          discountPrice: form.discount_percent ? (parseFloat(form.price) - (parseFloat(form.price) * parseFloat(form.discount_percent) / 100)) : null,
          variants: form.variantState ? variants : null, // Use variants state (array of objects)
          variantState: form.variantState,
          featured: form.featured,
          updatedAt: new Date().toISOString(),
        };
        
        console.log('Updating product with payload:', payload);
        const res = await fetch(API_ENDPOINTS.updateProduct(productToEdit!.product_id), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        const json = await res.json();
        if (!res.ok || !json.success) {
          setStatus('error');
          setApiError(json.message || 'Failed to update product.');
          return;
        }
        
        // Create or update variants if variantState is true and variants exist
        if (form.variantState && variants.length > 0) {
          let variantOpsSuccess = true;
          for (const variant of variants) {
            try {
              const variantPayload = {
                parent_product_id: productToEdit!.product_id,
                variant_name: variant.variant_name.trim(),
                variant_type: variant.variant_type || 'size',
                price: parseFloat(variant.price),
                quantity: parseInt(variant.quantity),
                discount_percent: variant.discount_percent ? parseFloat(variant.discount_percent) : null,
                image_gallery: variant.image_gallery && variant.image_gallery.length > 0 ? variant.image_gallery : null,
                description: variant.description ? variant.description.trim() : null,
              };
              if (variant.variant_id) {
                // Update existing variant
                const variantRes = await fetch(API_ENDPOINTS.updateProductVariant(variant.variant_id), {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(variantPayload),
                });
                const variantJson = await variantRes.json();
                if (!variantRes.ok) {
                  console.error('Failed to update variant:', variant.variant_name, variantJson);
                  variantOpsSuccess = false;
                  setApiError(`Failed to update variant: ${variant.variant_name} - ${variantJson.message}`);
                } else {
                  console.log('Variant updated successfully:', variantJson);
                }
              } else {
                // Create new variant
                const variantRes = await fetch(API_ENDPOINTS.createProductVariant, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(variantPayload),
                });
                const variantJson = await variantRes.json();
                if (!variantRes.ok) {
                  console.error('Failed to create variant:', variant.variant_name, variantJson);
                  variantOpsSuccess = false;
                  setApiError(`Failed to create variant: ${variant.variant_name} - ${variantJson.message}`);
                } else {
                  console.log('Variant created successfully:', variantJson);
                }
              }
            } catch (error) {
              console.error('Error creating/updating variant:', variant.variant_name, error);
              variantOpsSuccess = false;
              setApiError(`Error creating/updating variant: ${variant.variant_name}`);
            }
          }
          if (!variantOpsSuccess) {
            setStatus('error');
            return;
          }
        }

        setStatus('success');
        setTimeout(() => {
          onClose();
          onProductUpdated?.();
        }, 1200);
      }
    } catch (error: any) {
      setStatus('error');
      setApiError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !form.title.trim()) {
      setErrors({ title: 'Title is required to continue' });
      return;
    }
    if (step === 2 && !form.description.trim()) {
      setErrors({ description: 'Description is required to continue' });
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  if (!isOpen) return null;

  const isEditMode = mode === 'edit';
  const modalTitle = isEditMode ? 'Edit Product' : 'Add New Product';
  const submitButtonText = isEditMode ? 'Update Product' : 'Add Product';
  const submitButtonIcon = isEditMode ? <Save className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-100/80 to-emerald-200/90 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[95vh] flex flex-col border-2 border-green-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="inline-block"><Image src="/assets/logo_Without_Text.png" alt="logo" width={32} height={32} /></span>
                {modalTitle}
              </h2>
              <p className="text-green-100 mt-1">Step {step} of 3</p>
              {isEditMode && productToEdit && (
                <p className="text-green-100 text-sm mt-1">Editing: {productToEdit.title}</p>
              )}
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
          {/* Error summary alert */}
          {formErrorSummary.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              <strong>Please fix the following errors:</strong>
              <ul className="list-disc ml-5 mt-1">
                {formErrorSummary.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Vendor Brand Information */}
              {vendorBrandInfo && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Your Store Information
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        alert('Please go to Store Branding tab to update your store information.');
                      }}
                      className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Update Store Info
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Store Name</label>
                      <p className="text-sm text-gray-800 font-medium">{vendorBrandInfo.name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Business Name</label>
                      <p className="text-sm text-gray-800 font-medium">{vendorBrandInfo.business_name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Contact Person</label>
                      <p className="text-sm text-gray-800">{vendorBrandInfo.contact_person_name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Contact Email</label>
                      <p className="text-sm text-gray-800">{vendorBrandInfo.contact_email || 'Not set'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Business Address</label>
                      <p className="text-sm text-gray-800">{vendorBrandInfo.business_address || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
              {brandInfoLoading && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Loading store information...</span>
                  </div>
                </div>
              )}
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
                <div className="relative">
                  <input 
                    type="text" 
                    name="brand" 
                    value={form.brand} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.brand ? 'border-red-500' : 'border-gray-300'}`} 
                    placeholder={vendorBrandInfo?.business_name || vendorBrandInfo?.name || "Enter brand name"} 
                  />
                  {vendorBrandInfo && !isEditMode && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Auto-filled from store
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {vendorBrandInfo ? 
                    (isEditMode ? "You can edit the brand name or update your store information in the Store Branding section." : "Brand auto-filled from your store information. You can edit this field or update your store branding.") : 
                    "Enter your brand name or update your store information in the Store Branding section."
                  }
                </p>
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
                <div className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-green-500 transition-colors ${errors.image_gallery ? 'border-red-500' : 'border-gray-300'}`} onClick={() => fileInputRef.current?.click()}>
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload product images</p>
                  <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, JPEG up to 5MB each</p>
                  <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
                {errors.image_gallery && <p className="text-red-500 text-sm mt-1">{errors.image_gallery}</p>}
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
              {/* Enhanced Variants Management */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Package className="w-5 h-5 text-blue-600" />
                  <input type="checkbox" name="variantState" checked={form.variantState} onChange={handleChange} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                  <label className="text-sm font-medium text-gray-700">This product has variants (sizes, colors, etc.)</label>
                </div>
                
                {form.variantState && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Product Variants
                      </h4>
                      <p className="text-xs text-gray-600 mb-4">
                        Each variant will be created as a separate product with its own pricing, stock, and images. 
                        All variants will share the same product page but with different options.
                      </p>
                      
                      {variants.map((variant, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium text-gray-700">Variant {index + 1}</h5>
                            <button 
                              aria-label="Remove variant" 
                              type="button" 
                              onClick={() => removeVariant(index)} 
                              className="text-red-500 hover:text-red-700 p-1 rounded"
                              disabled={variantDeleteLoading === variant.variant_id}
                            >
                              {variantDeleteLoading === variant.variant_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Variant Name *</label>
                              <input 
                                type="text" 
                                value={variant.variant_name} 
                                onChange={(e) => updateVariant(index, 'variant_name', e.target.value)} 
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="e.g., Small, Medium, Large, Red, Blue"
                              />
                              {errors[`variant_${index}_name`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_name`]}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Variant Type</label>
                              <select 
                                value={variant.variant_type} 
                                onChange={(e) => updateVariant(index, 'variant_type', e.target.value)} 
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {variantTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
                              <input 
                                type="number" 
                                value={variant.price} 
                                onChange={(e) => updateVariant(index, 'price', e.target.value)} 
                                min="0" 
                                step="0.01" 
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="0.00"
                              />
                              {errors[`variant_${index}_price`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_price`]}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
                              <input 
                                type="number" 
                                value={variant.quantity} 
                                onChange={(e) => updateVariant(index, 'quantity', e.target.value)} 
                                min="0" 
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="0"
                              />
                              {errors[`variant_${index}_quantity`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`variant_${index}_quantity`]}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Discount %</label>
                              <input 
                                type="number" 
                                value={variant.discount_percent} 
                                onChange={(e) => updateVariant(index, 'discount_percent', e.target.value)} 
                                min="0" 
                                max="100" 
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="0"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Variant Description</label>
                            <textarea 
                              value={variant.description} 
                              onChange={(e) => updateVariant(index, 'description', e.target.value)} 
                              rows={2} 
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                              placeholder="Optional description for this variant..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Variant Images</label>
                            <div 
                              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                              onClick={() => variantFileInputRefs.current[`variant-${index}`]?.click()}
                            >
                              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-600">Click to upload variant images</p>
                              <input
                                type="file"
                                ref={el => { variantFileInputRefs.current[`variant-${index}`] = el as HTMLInputElement; }}
                                multiple
                                accept="image/*"
                                onChange={(e) => handleVariantImageUpload(index, e)}
                                className="hidden"
                              />
                            </div>

                            {/* Variant Image Preview */}
                            {normalizeVariantGallery(variant.image_gallery).length > 0 && (
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                {normalizeVariantGallery(variant.image_gallery).map((img, imgIndex) => (
                                  <div key={imgIndex} className="relative group">
                                    <Image
                                      width={100}
                                      height={100}
                                      src={img}
                                      alt={`Variant ${variant.variant_name} image ${imgIndex + 1}`}
                                      className="w-full h-20 object-cover rounded-lg"
                                    />
                                    <button
                                      aria-label="Remove variant image"
                                      type="button"
                                      onClick={() => removeVariantImage(index, imgIndex)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        aria-label="Add variant" 
                        type="button" 
                        onClick={addVariant} 
                        className="w-full text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-2 text-sm py-2 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Variant</span>
                      </button>
                      
                      {errors.variants && (
                        <p className="text-red-500 text-sm mt-2">{errors.variants}</p>
                      )}
                    </div>
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
              <button aria-label={submitButtonText} type="button" onClick={handleSubmit} disabled={loading || vendorIdLoading || !vendorId} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">{loading ? (<Loader2 className="w-4 h-4 animate-spin" />) : submitButtonIcon}<span>{loading ? `${isEditMode ? 'Updating' : 'Adding'} Product...` : submitButtonText}</span></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingModal; 