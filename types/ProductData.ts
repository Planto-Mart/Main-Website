export default interface ProductDataType{
    product_id: string; //
    slug: string;
    title: string;
    description: string;
    category: string;
    aboutInBullets: string[];
    image_gallery: string[];
    price: number;
    brand: string;
    vendorID: string;
    raiting:number;
    reviewNumbers: number;
    reviews?: string[];
    quantity: number;
    discountPercent?: number;
    discountPrice?: number;
    variants? : string[]; // Array of variant product IDs
    variantState: boolean;
}

// /products/{vendor-slug}/{product-slug}