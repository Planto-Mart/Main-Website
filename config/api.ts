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
    
    // Admin-only vendor endpoints
    getAllVendorsAdmin: `${API_BASE_URL}/vendor/get-all-vendors-admin`,
    getVendorByUserUUIDAdmin: (user_uuid: string) => `${API_BASE_URL}/vendor/get-admin/${user_uuid}`,
    
    // product Endpoints
    createProduct: `${API_BASE_URL}/product/create-new`,
    getAllProducts: `${API_BASE_URL}/product/get-all`,
    getProductsByVendor: (vendorID: string) => `${API_BASE_URL}/product/get-products-of/${vendorID}`,
    getProductById: (user_uuid: string) => `${API_BASE_URL}/product/get/${user_uuid}`,
    deleteProduct: (user_uuid: string) => `${API_BASE_URL}/product/delete/${user_uuid}`,
    updateProduct: (user_uuid: string) => `${API_BASE_URL}/product/update/${user_uuid}`,


}   