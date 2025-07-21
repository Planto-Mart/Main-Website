/* eslint-disable no-unused-vars */
"use client";
import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Edit, Eye, Filter, Plus, Search, Trash2 } from 'lucide-react';
import ProductListingModal from './Product-Listings-modal';
import ProductDataType from '@/types/ProductData';
import { API_ENDPOINTS } from '@/config/api';

interface ProductsTabProps {
  products: ProductDataType[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  user: any;
  vendorId: string | null;
}

function ProductsTab({ products, loading, error, onRefresh, user, vendorId }: ProductsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductListingModalOpen, setIsProductListingModalOpen] = useState(false);
  const vendorID = user?.id || user?.user_id || user?.uuid || '';
  const [filterStatus, setFilterStatus] = useState('all');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductDataType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Add state for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductDataType | null>(null);
  const [editModalLoading, setEditModalLoading] = useState(false);

  // Filter products based on search term and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.product_id?.toLowerCase().includes(searchTerm.toLowerCase());
    // Status logic can be improved if backend provides it
    const matchesFilter = filterStatus === 'all' || product.quantity === 0 || (filterStatus === 'active' && product.quantity > 0);
    return matchesSearch && matchesFilter;
  });

  // Helper function to get status color
  const getStatusColor = (product: ProductDataType) => {
    if (product.quantity === 0) return 'bg-red-100 text-red-800';
    if (product.quantity < 5) return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  };

  // Loading and error UI
  if (loading || refreshLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-gray-500">Loading products...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-red-600">
        <span>{error}</span>
        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50" onClick={onRefresh} disabled={!vendorId}>Retry</button>
      </div>
    );
  }

  // Delete product handler
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(API_ENDPOINTS.deleteProduct(productToDelete.product_id), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to delete product');
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Delete failed');
      // Reset modal state BEFORE refresh
      setDeleteModalOpen(false);
      setProductToDelete(null);
      setDeleteError(null);
      setDeleteLoading(false);
      // Show refresh spinner while reloading
      setRefreshLoading(true);
      await Promise.resolve(onRefresh());
      setRefreshLoading(false);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete product');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button type='button' className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" onClick={() => setIsProductListingModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Product
        </button>
      </div>
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative inline-block">
          <div className="flex">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => {}}
            >
              <Filter className="mr-2 size-4 text-gray-500" />
              Filter
              <ChevronDown className="ml-1 size-4 text-gray-500" />
            </button>
          </div>
          {/* Filter dropdown would go here */}
        </div>
      </div>
      {/* Products Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={product.image_gallery && product.image_gallery.length > 0 ? product.image_gallery[0] : '/assets/placeholder.jpg'}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.product_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{product.quantity}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(product)}`}>
                        {product.quantity === 0 ? 'Out of Stock' : product.quantity < 5 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          type='button'
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          onClick={() => {
                            const slug = product.slug || product.product_id;
                            window.open(`/product/${slug}`, '_blank');
                          }}
                          title="View"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type='button'
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          onClick={async () => {
                            setEditModalLoading(true);
                            try {
                              const res = await fetch(API_ENDPOINTS.getProductBySlug(product.slug), {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json' },
                              });
                              const json = await res.json();
                              if (json.success && json.data) {
                                setProductToEdit(json.data);
                                setIsEditModalOpen(true);
                              } else {
                                alert('Failed to load product details for editing.');
                              }
                            } catch (err) {
                              alert('Error loading product details.');
                            } finally {
                              setEditModalLoading(false);
                            }
                          }}
                          title="Edit"
                          disabled={editModalLoading}
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          type='button'
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-700"
                          onClick={() => {
                            setProductToDelete(product);
                            setDeleteModalOpen(true);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Confirm Delete</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete <span className="font-semibold">{productToDelete.title}</span>? This action cannot be undone.
            </p>
            {deleteError && <div className="mb-2 text-red-600">{deleteError}</div>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setProductToDelete(null);
                  setDeleteError(null);
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Product Listing Modal for Create */}
      <ProductListingModal
        isOpen={isProductListingModalOpen}
        onClose={() => setIsProductListingModalOpen(false)}
        // vendorID={vendorID}
        onProductCreated={onRefresh}
      />
      {/* Product Listing Modal for Edit */}
      {productToEdit && (
        <ProductListingModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setProductToEdit(null);
          }}
          productToEdit={productToEdit}
          mode="edit"
          onProductCreated={onRefresh}
          onProductUpdated={() => {
            setIsEditModalOpen(false);
            setProductToEdit(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

export default ProductsTab;