// export const API_BASE_URL = process.env.BACKEND_API_BASE_URL || 'http://127.0.0.1:8787';
export const API_BASE_URL = 'https://backend-server.developer-plantomart.workers.dev';

export const API_ENDPOINTS = {
    // userProfile Endpoints 
    createProfile: `${API_BASE_URL}/user-profile/create-profile`, // Creating a new user profile
    getAllProfiles: `${API_BASE_URL}/user-profile/get-all-profiles`, // Fetching all userProfiles
    getProfileByUUID: (uuid: string) => `${API_BASE_URL}/user-profile/get/${uuid}`, // Fetching a specific userProfile by uuid
    updateProfileByUUID: (uuid: string) => `${API_BASE_URL}/user-profile/update/${uuid}`, // Updating a specific userProfile by uuid

    // vendor Endpoints
    vendorRegister: `${API_BASE_URL}/vendor/register`,
    updateVendorById: (vendor_id: string) => `${API_BASE_URL}/vendor/update/${vendor_id}`,
    deleteVendorById: (vendor_id: string) => `${API_BASE_URL}/vendor/delete/${vendor_id}`,

    getAllVendorsPublic: `${API_BASE_URL}/vendor/get-all-vendors`,
    getVendorByUserUUID: (user_uuid: string) => `${API_BASE_URL}/vendor/get/${user_uuid}`,
    getVendorBySlug: (slug: string) => `${API_BASE_URL}/vendor/get-by-slug/${slug}`,
    
    // Admin-only vendor endpoints
    getAllVendorsAdmin: `${API_BASE_URL}/vendor/get-all-vendors-admin`,
    getVendorByUserUUIDAdmin: (user_uuid: string) => `${API_BASE_URL}/vendor/get-admin/${user_uuid}`,
    
    // product Endpoints
    createProduct: `${API_BASE_URL}/product/create-new`,
    getAllProducts: `${API_BASE_URL}/product/get-all`,
    getFeaturedProducts: `${API_BASE_URL}/product/featured`,
    getProductsByVendor: (vendorID: string) => `${API_BASE_URL}/product/get-products-of/${vendorID}`,
    getProductById: (product_id: string) => `${API_BASE_URL}/product/get/${product_id}`,
    deleteProduct: (product_id: string) => `${API_BASE_URL}/product/delete/${product_id}`,
    updateProduct: (user_uuid: string) => `${API_BASE_URL}/product/update/${user_uuid}`,
    getProductBySlug: (slug: string) => `${API_BASE_URL}/product/get-by-slug/${slug}`,
    getProductsByStartingPrice: (price: number, range?: number) => `${API_BASE_URL}/product/starting-price?price=${price}${range !== undefined ? `&range=${range}` : ''}`,
    getProductsByMinDiscount: (discount: number) => `${API_BASE_URL}/product/discounted/${discount}`,
    getTopRatedProductsByVendor: (vendorID: string) => `${API_BASE_URL}/product/top-rated?vendorID=${vendorID}`,
    getFeaturedProductsByCategory: (category: string) => `${API_BASE_URL}/product/featured-on-category/${encodeURIComponent(category)}`,

    // product variant Endpoints
    createProductVariant: `${API_BASE_URL}/product/variants/create`,
    updateProductVariant: (variant_id: string) => `${API_BASE_URL}/product/variants/update/${variant_id}`,
    deleteProductVariant: (variant_id: string) => `${API_BASE_URL}/product/variants/delete/${variant_id}`,

    // product combinations endpoints 
    createProductCombination: `${API_BASE_URL}/product/combinations/create`,
    bulkCreateProductCombinations: `${API_BASE_URL}/product/combinations/bulk-create`,
    getAllProductCombinations: `${API_BASE_URL}/product/combinations`,
    getProductCombinationById: (id: string) => `${API_BASE_URL}/product/combinations/${id}`,
    updateProductCombinationById: (id: string) => `${API_BASE_URL}/product/combinations/${id}`,
    deleteProductCombinationById: (id: string) => `${API_BASE_URL}/product/combinations/${id}`,
    getCombinationsForProduct: (productId: string) => `${API_BASE_URL}/product/${productId}/combinations`,
    deleteCombinationsForProduct: (productId: string) => `${API_BASE_URL}/product/${productId}/combinations`,
    getCombinationsContainingProduct: (productId: string) => `${API_BASE_URL}/product/${productId}/containing-combinations`,

    // ===== Product Review Endpoints =====
    createProductReview: `${API_BASE_URL}/product/reviews/create`,
    getReviewByProductID: (productId: string) => `${API_BASE_URL}/product/reviews/product/${productId}`,
    getProductReview: (reviewId: string) => `${API_BASE_URL}/product/reviews/${reviewId}`,
    updateProductReview: (reviewId: string) => `${API_BASE_URL}/product/update-review/${reviewId}`,// 
    deleteProductReview: (reviewId: string) => `${API_BASE_URL}/product/reviews/${reviewId}`,
    likeReview: (reviewId: string) => `${API_BASE_URL}/product/reviews/${reviewId}/like`,
    dislikeReview: (reviewId: string) => `${API_BASE_URL}/product/reviews/${reviewId}/dislike`,
    removeLikeDislike: (reviewId: string) => `${API_BASE_URL}/product/reviews/${reviewId}/remove-reaction`,
    addReplyToReview: (reviewId: string) => `${API_BASE_URL}/product/reviews/${reviewId}/replies`,
    deleteAllReviewsForProduct: (productId: string) => `${API_BASE_URL}/reviews/product/${productId}`,
    getReviewStats: (productId: string) => `${API_BASE_URL}/product/reviews/product/${productId}/stats`,
    bulkDeleteReviews: `${API_BASE_URL}/product/reviews/bulk-delete`,
    getRecentReviews: `${API_BASE_URL}/product/reviews/recent`  


}   