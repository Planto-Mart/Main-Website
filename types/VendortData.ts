export default interface VendorDataType{
    vendor_id: string;
    slug: string;
    name: string;
    description: string;
    bannerImage: string;
    logo: string;
    rating: Float64Array;
    AboutUs: string;
    categories: string[];
    products: string[]; // Array of product IDs
    features: string[];
}