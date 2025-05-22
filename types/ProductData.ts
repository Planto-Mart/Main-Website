export default interface ProductDataType{
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    aboutInBullets: string[];
    image: string[];
    price: number;
    vendorID: string;
    raiting:number;
    reviewNumbers: number;
    reviews?: string[];
    stock: number;
    status: string;
    discountPercent?: number;
    discountPrice?: number;
    variants? : string[]; // Array of variant product IDs
    variantState: boolean;
}
