export default interface ProductDataType {
  productSeq: number;
  product_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  about_in_bullets: string[]; // JSON
  image_gallery: string[];    // JSON
  price: number;
  brand: string;
  vendor_id: string;
  raiting: number;
  reviewNumbers: number;
  reviews?: string[];         // JSON
  quantity: number;
  discountPercent?: number;
  discountPrice?: number;
  variants?: string[];        // JSON
  variant_state: boolean;
  featured: boolean;
  created_at: string;         // ISO date string
  updated_at: string;         // ISO date string
}


// /products/{vendor-slug}/{product-slug}