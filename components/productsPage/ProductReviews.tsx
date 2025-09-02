"use client";
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Send, Filter, Clock, TrendingUp, AlertCircle, Leaf, User } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';
import Image from 'next/image';
import SignIn from '../auth/Sign-in';
import Link from 'next/link';

interface UserProfile {
  user_uuid: string;
  full_name: string;
  avatar_url?: string;
  email?: string;
}

interface Reply {
  user_uuid: string;
  comment: string;
  created_at: string;
}

interface Review {
  review_id: string;
  product_id: string;
  user_uuid: string;
  likes: number;
  liked_by: string[];
  disliked_by: string[];
  dislikes: number;
  comments: string;
  replies: Reply[];
  created_at: string;
  updated_at: string;
}

interface Product {
  product_id: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
}

interface ReviewStats {
  totalReviews: number;
  totalLikes: number;
  totalDislikes: number;
  totalReplies: number;
  averageLikes: number;
  averageDislikes: number;
  mostLikedReview?: {
    review_id: string;
    likes: number;
    comments: string;
  };
}

interface ProductReviewsProps {
  slug: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ slug }) => {
  // Authentication state
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Product and reviews state
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User profiles cache
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());

  // Filtering and sorting state
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes' | 'dislikes'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);

  // Form state
  const [newReview, setNewReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Fetch user profile by UUID
  const fetchUserProfile = async (userUuid: string): Promise<UserProfile | null> => {
    // Check if we already have this user's profile cached
    if (userProfiles.has(userUuid)) {
      return userProfiles.get(userUuid)!;
    }

    try {
      const response = await fetch(API_ENDPOINTS.getProfileByUUID(userUuid));
      const data = await response.json();
      
      if (data.success && data.data) {
        const profile = data.data;
        // Cache the profile
        setUserProfiles(prev => new Map(prev).set(userUuid, profile));
        return profile;
      }
    } catch (error) {
      console.error(`Error fetching profile for user ${userUuid}:`, error);
    }
    
    return null;
  };

  // Fetch multiple user profiles
  const fetchUserProfiles = async (userUuids: string[]) => {
    const uniqueUuids = [...new Set(userUuids)].filter(uuid => !userProfiles.has(uuid));
    
    if (uniqueUuids.length === 0) return;

    const profilePromises = uniqueUuids.map(uuid => fetchUserProfile(uuid));
    await Promise.all(profilePromises);
  };

  // Fetch user authentication data
  const fetchUserData = async () => {
    try {
      setAuthChecking(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Got the session as: ", session);
      
      if (!session) {
        setIsAuthenticated(false);
        setAuthChecking(false);
        return;
      }
      
      setUser(session.user);
      setIsAuthenticated(true);
      setAuthChecking(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthChecking(false);
    }
  };

  // Fetch product by slug
  const fetchProduct = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.getProductBySlug(slug));
      const data = await response.json();
      
      if (data.success && data.data) {
        setProduct(data.data);
        return data.data.product_id;
      } else {
        throw new Error(data.message || 'Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
      return null;
    }
  };

  // Fetch reviews for the product
  const fetchReviews = async (productId: string) => {
    try {
      const params = new URLSearchParams({
        sortBy,
        page: currentPage.toString(),
        limit: reviewsPerPage.toString()
      });

      const response = await fetch(`${API_ENDPOINTS.getReviewByProductID(productId)}`);
      const data = await response.json();
      console.log("Reviews as product ID: ", data);
      
      if (data.success) {
        const reviewsData = data.data || [];
        setReviews(reviewsData);
        
        // Extract all unique user UUIDs from reviews and replies
        const userUuids = new Set<string>();
        reviewsData.forEach((review: Review) => {
          userUuids.add(review.user_uuid);
          review.replies.forEach((reply: Reply) => {
            userUuids.add(reply.user_uuid);
          });
        });
        
        // Fetch user profiles for all users
        await fetchUserProfiles(Array.from(userUuids));
      } else {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    }
  };

  // Fetch review statistics
  const fetchReviewStats = async (productId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.getReviewStats(productId));
      const data = await response.json();
      
      if (data.success) {
        setReviewStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      setLoading(true);
      await fetchUserData();
      
      const productId = await fetchProduct();
      if (productId) {
        await Promise.all([
          fetchReviews(productId),
          fetchReviewStats(productId)
        ]);
      }
      
      setLoading(false);
    };

    initializeComponent();
  }, [slug]);

  // Refetch reviews when sorting or pagination changes
  useEffect(() => {
    if (product?.product_id) {
      fetchReviews(product.product_id);
    }
  }, [sortBy, currentPage]);

  // Submit new review
  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user || !product || newReview.trim().length < 10) {
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(API_ENDPOINTS.createProductReview, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.product_id,
          user_uuid: user.id,
          comments: newReview.trim()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setNewReview('');
        await fetchReviews(product.product_id);
        await fetchReviewStats(product.product_id);
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle like/dislike
  const handleReaction = async (reviewId: string, action: 'like' | 'dislike' | 'remove') => {
    if (!isAuthenticated || !user) return;

    try {
      let endpoint;
      switch (action) {
        case 'like':
          endpoint = API_ENDPOINTS.likeReview(reviewId);
          break;
        case 'dislike':
          endpoint = API_ENDPOINTS.dislikeReview(reviewId);
          break;
        case 'remove':
          endpoint = API_ENDPOINTS.removeLikeDislike(reviewId);
          break;
      }

      const response = await fetch(endpoint, {
        method: action === 'remove' ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_uuid: user.id })
      });

      const data = await response.json();
      
      if (data.success && product) {
        await fetchReviews(product.product_id);
        await fetchReviewStats(product.product_id);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  // Submit reply
  const handleSubmitReply = async (reviewId: string) => {
    if (!isAuthenticated || !user || !replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const response = await fetch(API_ENDPOINTS.addReplyToReview(reviewId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_uuid: user.id,
          comment: replyText.trim()
        })
      });

      const data = await response.json();
      
      if (data.success && product) {
        setReplyText('');
        setShowReplyForm(null);
        await fetchReviews(product.product_id);
      } else {
        alert(data.message || 'Failed to submit reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserReaction = (review: Review) => {
    if (!user) return null;
    if (review.liked_by.includes(user.id)) return 'liked';
    if (review.disliked_by.includes(user.id)) return 'disliked';
    return null;
  };

  // Get user profile for display
  const getUserProfile = (userUuid: string): UserProfile | null => {
    return userProfiles.get(userUuid) || null;
  };

  // Render user avatar and name
  const renderUserAvatar = (userUuid: string, size: 'small' | 'medium' = 'medium') => {
    const profile = getUserProfile(userUuid);
    const sizeClasses = size === 'small' ? 'w-8 h-8' : 'w-12 h-12';
    const iconSize = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';
    
    if (profile?.avatar_url) {
      return (
        <Image
          src={profile.avatar_url}
          alt={profile.full_name || 'User'}
          width={size === 'small' ? 32 : 48}
          height={size === 'small' ? 32 : 48}
          className={`${sizeClasses} rounded-full border-2 border-emerald-200 bg-white object-cover`}
        />
      );
    }
    
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center`}>
        <User className={`${iconSize} text-white`} />
      </div>
    );
  };

  const renderUserName = (userUuid: string) => {
    const profile = getUserProfile(userUuid);
    return profile?.full_name || 'Anonymous User';
  };

  if (loading && authChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-emerald-700 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        {/* Product Header */}
        {product && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-emerald-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <p className="text-gray-600">Customer Reviews & Feedback</p>
              </div>
            </div>
          </div>
        )}

        {/* Review Statistics */}
        {reviewStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
                  <p className="text-2xl font-bold text-emerald-600">{reviewStats.totalReviews}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Likes</p>
                  <p className="text-2xl font-bold text-blue-600">{reviewStats.totalLikes}</p>
                </div>
                <ThumbsUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Replies</p>
                  <p className="text-2xl font-bold text-purple-600">{reviewStats.totalReplies}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg. Likes</p>
                  <p className="text-2xl font-bold text-orange-600">{reviewStats.averageLikes}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews Section */}
          <div className="lg:col-span-2">
            {/* Filters and Sorting */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-emerald-100">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Sort Reviews:</span>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'newest', label: 'Newest', icon: Clock },
                    { value: 'oldest', label: 'Oldest', icon: Clock },
                    { value: 'likes', label: 'Most Liked', icon: ThumbsUp },
                    { value: 'dislikes', label: 'Most Disliked', icon: ThumbsDown }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortBy(value as any);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        sortBy === value
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-emerald-100">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No reviews yet</h3>
                  <p className="text-gray-500">Be the first to share your experience with this product!</p>
                </div>
              ) : (
                reviews.map((review) => {
                  const userReaction = getUserReaction(review);
                  
                  return (
                    <div key={review.review_id} className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {renderUserAvatar(review.user_uuid)}
                          <div>
                            <p className="font-semibold text-gray-800">{renderUserName(review.user_uuid)}</p>
                            <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">{review.comments}</p>
                      </div>

                      {/* Review Actions */}
                      <div className="flex items-center gap-4 mb-4">
                        {isAuthenticated ? (
                          <>
                            <button
                              onClick={() => handleReaction(review.review_id, userReaction === 'liked' ? 'remove' : 'like')}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                userReaction === 'liked'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.likes}</span>
                            </button>
                            
                            <button
                              onClick={() => handleReaction(review.review_id, userReaction === 'disliked' ? 'remove' : 'dislike')}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                userReaction === 'disliked'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                              }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                              <span>{review.dislikes}</span>
                            </button>
                            
                            <button
                              onClick={() => setShowReplyForm(showReplyForm === review.review_id ? null : review.review_id)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Reply</span>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-4 text-gray-500">
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.likes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ThumbsDown className="w-4 h-4" />
                              <span>{review.dislikes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              <span>{review.replies.length}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reply Form */}
                      {showReplyForm === review.review_id && (
                        <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-3 border border-emerald-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              onClick={() => setShowReplyForm(null)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSubmitReply(review.review_id)}
                              disabled={!replyText.trim() || submittingReply}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <Send className="w-4 h-4" />
                              {submittingReply ? 'Posting...' : 'Post Reply'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {review.replies.length > 0 && (
                        <div className="space-y-3 pl-6 border-l-2 border-emerald-200">
                          {review.replies.map((reply, index) => (
                            <div key={index} className="bg-emerald-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                {renderUserAvatar(reply.user_uuid, 'small')}
                                <span className="text-sm text-emerald-700 font-medium">{renderUserName(reply.user_uuid)}</span>
                                <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {reviews.length === reviewsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-emerald-200 rounded-lg text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 transition-all duration-200"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium">
                    Page {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 bg-white border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Write Review Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-600" />
                Write a Review
              </h3>
              
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Please sign in to write a review</p>
                  <button 
                    // onClick={()=> {<SignIn isOpen={true} onClose={()=>{false}}/>}}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 font-medium">
                    <Link href={"/signup"}>
                        Sign In 
                    </Link>
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-4 border border-emerald-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
                    rows={5}
                  />
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${newReview.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                      {newReview.length}/10 min characters
                    </span>
                    <button
                      onClick={handleSubmitReview}
                      disabled={newReview.trim().length < 10 || submittingReview}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      <Send className="w-4 h-4" />
                      {submittingReview ? 'Posting...' : 'Post Review'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Most Liked Review
            {reviewStats?.mostLikedReview && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border border-orange-200">
                <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-600" />
                  Most Liked Review
                </h3>
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <p className="text-gray-700 mb-3">{reviewStats.mostLikedReview.comments}</p>
                  <div className="flex items-center gap-2 text-orange-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="font-semibold">{reviewStats.mostLikedReview.likes} likes</span>
                  </div>
                </div>
              </div>
            )} */}

            {/* Review Guidelines */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-lg p-6 border border-emerald-200">
              <h3 className="text-lg font-bold text-emerald-800 mb-4">Review Guidelines</h3>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be honest and helpful to other customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Focus on product quality and experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep reviews respectful and constructive</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Minimum 10 characters required</span>
                </li>
              </ul>
            </div>

            {/* Authentication Reminder */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Join the Community</h3>
                <p className="text-blue-700 mb-4">Sign in to interact with reviews, share your thoughts, and help other plant lovers make informed decisions!</p>
                <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium">
                    <Link href={"/signup"}>
                        Create Account / Sign In
                    </Link>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State for No Product */}
        {!product && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <AlertCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the product you're looking for.</p>
            <button className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 font-medium">
              Browse Products
            </button>
          </div>
        )}

        {/* Loading States */}
        {(authChecking || loading) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4">
                <Leaf className="w-8 h-8 text-emerald-600 animate-spin" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {authChecking ? 'Checking authentication...' : 'Loading reviews...'}
                  </p>
                  <p className="text-sm text-gray-500">Please wait</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 lg:hidden">
          <button
            onClick={() => {
              const reviewForm = document.getElementById('review-form');
              reviewForm?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center"
          >
            <Star className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Success/Error Toast */}
      <div className="fixed top-4 right-4 z-50">
        {/* This would typically be connected to a toast system */}
      </div>
    </div>
  );
};

export default ProductReviews;