export default interface ProductDataType {
  productSeq: number;
  product_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  about_in_bullets: string[]; // JSON
  content_description: string;
  content_shipping_delivery: string;
  image_gallery: string[];    // JSON
  price: number;
  brand: string;
  vendorID: string;
  raiting: number;
  reviewNumbers: number;
  reviews?: string[];         // JSON
  quantity: number;
  discountPercent?: number;
  discountPrice?: number;
  variants?: string[];        // JSON
  variantState: boolean;
  featured: boolean;
  created_at: string;         // ISO date string
  updated_at: string;         // ISO date string
}

// Product Variant Type (matches backend productVariants table)
export interface ProductVariantType {
  variant_id: string;
  parent_product_id: string;
  slug: string;
  variant_name: string;
  variant_type: string;
  price: number;
  quantity: number;
  discount_percent?: number;
  discount_price?: number;
  image_gallery?: string[];
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


// /products/{vendor-slug}/{product-slug}