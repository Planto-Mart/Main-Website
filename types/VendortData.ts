export default interface VendorDataType{
    id: string;
    slug: string;
    name: string;
    description: string;
    bannerImage: string;
    logo: string;
    rating: Float16Array;
    AboutUs: string;
    categories: string[];
    products: string[]; // Array of product IDs
    features: string[];
}