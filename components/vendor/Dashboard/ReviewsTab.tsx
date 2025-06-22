/* eslint-disable no-unused-vars */
"use client";
import  { useState } from 'react';
import { Star, Search, Filter, ChevronDown } from 'lucide-react';

interface Review {
  id: string;
  product: string;
  customer: string;
  date: string;
  rating: number;
  comment: string;
  status: string;
}

interface ReviewsTabProps {
  reviews: Review[];
}

function ReviewsTab({ reviews }: ReviewsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // biome-ignore lint/correctness/noUnusedVariables: will see if needed later
  const [filterRating, setFilterRating] = useState('all');

  // Filter reviews based on search term and rating
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.product.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRating === 'all' || review.rating.toString() === filterRating;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Manage customer reviews for your products</p>
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
            placeholder="Search reviews..."
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
      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                  {review.customer.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{review.customer}</h3>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-2 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      // biome-ignore lint/suspicious/noArrayIndexKey: not needed here
                      key={i}
                      className={`size-4 ${
                        i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
              </div>
            </div>
            <div className="mb-3">
              <h4 className="mb-1 text-sm font-medium text-gray-900">
                Product: {review.product}
              </h4>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button type='button' className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Reply
              </button>
              {review.status !== 'published' && (
                <button type='button' className="rounded-md border border-green-600 bg-white px-3 py-1 text-xs font-medium text-green-600 shadow-sm hover:bg-green-50">
                  Publish
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredReviews.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
              <Star className="size-6 text-gray-400" />
            </div>
            <h3 className="mb-1 text-base font-medium text-gray-900">No reviews found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search or filter criteria' : 'You have no reviews yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsTab;