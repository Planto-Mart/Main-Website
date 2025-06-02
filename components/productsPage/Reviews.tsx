// /* eslint-disable import/no-unresolved */
// "use client";

// import React, { useState, useEffect } from 'react';
// import { Star, StarHalf, User, Loader2 } from 'lucide-react';
// import Image from 'next/image';

// import SignIn from '../auth/Sign-in';

// import { supabase } from '@/utils/supabase/client';

// interface ReviewProps {
//   productId: string;
// }

// interface Review {
//   id: string;
//   userId: string;
//   userName: string;
//   userAvatar?: string;
//   rating: number;
//   comment: string;
//   createdAt: string;
// }

// interface UserProfile {
//   id: string;
//   email: string;
//   full_name?: string;
//   avatar_url?: string;
// }

// const Reviews: React.FC<ReviewProps> = ({ productId }) => {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [isSignInOpen, setIsSignInOpen] = useState(false);
//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Check authentication status and load reviews on mount
//   useEffect(() => {
//     checkUser();
//     loadReviews();
//   }, [productId]);

//   const checkUser = async () => {
//     const { data: { session } } = await supabase.auth.getSession();
//     if (session?.user) {
//       const { data: profile } = await supabase
//         .from('profiles_dev')
//         .select('*')
//         .eq('uuid', session.user.id)
//         .single();
      
//       setUser(profile);
//     }
//   };

//   const loadReviews = async () => {
//     try {
//       const { data: reviewsData, error } = await supabase
//         .from('product_reviews')
//         .select(`
//           id,
//           user_id,
//           rating,
//           comment,
//           created_at,
//           profiles_dev:user_id (full_name, avatar_url)
//         `)
//         .eq('product_id', productId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const formattedReviews: Review[] = reviewsData.map(review => ({
//         id: review.id,
//         userId: review.user_id,
//         userName: review.profiles_dev?.full_name || 'Anonymous',
//         userAvatar: review.profiles_dev?.avatar_url,
//         rating: review.rating,
//         comment: review.comment,
//         createdAt: new Date(review.created_at).toLocaleDateString()
//       }));

//       setReviews(formattedReviews);
//     } catch (error) {
//       console.error('Error loading reviews:', error);
//       setError('Failed to load reviews');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmitReview = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const { data, error } = await supabase
//         .from('product_reviews')
//         .insert({
//           product_id: productId,
//           user_id: user.id,
//           rating: newReview.rating,
//           comment: newReview.comment,
//           created_at: new Date().toISOString()
//         })
//         .select();

//       if (error) throw error;

//       // Reset form and reload reviews
//       setNewReview({ rating: 5, comment: '' });
//       await loadReviews();
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       setError('Failed to submit review');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<Star key={`full-${i}`} className="size-5 fill-yellow-400 text-yellow-400" />);
//     }

//     if (hasHalfStar) {
//       stars.push(<StarHalf key="half" className="size-5 fill-yellow-400 text-yellow-400" />);
//     }

//     const remainingStars = 5 - stars.length;
//     for (let i = 0; i < remainingStars; i++) {
//       stars.push(<Star key={`empty-${i}`} className="size-5 text-gray-300" />);
//     }

//     return stars;
//   };

//   return (
//     <div className="mx-auto max-w-4xl py-8">
//       <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
//       {/* Review Form */}
//       <div className="mb-8 rounded-lg border border-gray-200 p-6">
//         <h3 className="mb-4 text-xl font-semibold">Write a Review</h3>
//         {user ? (
//           <form onSubmit={handleSubmitReview}>
//             <div className="mb-4">
//               <label className="mb-2 block text-sm font-medium">Rating</label>
//               <div className="flex items-center space-x-1">
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                   <button
//                     key={rating}
//                     type="button"
//                     onClick={() => setNewReview(prev => ({ ...prev, rating }))}
//                     className="focus:outline-none"
//                   >
//                     <Star
//                       className={`size-6 ${rating <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="mb-2 block text-sm font-medium">Your Review</label>
//               <textarea
//                 value={newReview.comment}
//                 onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
//                 className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
//                 rows={4}
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
//             >
//               {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
//               Submit Review
//             </button>
//             {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
//           </form>
//         ) : (
//           <div className="text-center">
//             <p className="mb-4 text-gray-600">Please sign in to write a review</p>
//             <button
//               onClick={() => setIsSignInOpen(true)}
//               className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
//             >
//               Sign In to Review
//             </button>
//           </div>
//         )}
//       </div>
//       {/* Reviews List */}
//       {isLoading ? (
//         <div className="flex items-center justify-center py-8">
//           <Loader2 className="size-8 animate-spin text-green-600" />
//         </div>
//       ) : reviews.length > 0 ? (
//         <div className="space-y-6">
//           {reviews.map((review) => (
//             <div key={review.id} className="rounded-lg border border-gray-200 p-6">
//               <div className="mb-4 flex items-center">
//                 <div className="mr-4">
//                   {review.userAvatar ? (
//                     <div className="relative size-10 overflow-hidden rounded-full">
//                       <Image
//                         src={review.userAvatar}
//                         alt={review.userName}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   ) : (
//                     <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
//                       <User className="size-6 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <h4 className="font-medium">{review.userName}</h4>
//                   <div className="flex items-center">
//                     <div className="mr-2 flex">{renderStars(review.rating)}</div>
//                     <span className="text-sm text-gray-500">{review.createdAt}</span>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-700">{review.comment}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-600">No reviews yet. Be the first to review this product!</p>
//       )}
//       {/* Sign In Modal */}
//       <SignIn
//         isOpen={isSignInOpen}
//         onClose={() => setIsSignInOpen(false)}
//         redirectUrl={`/product/${productId}`}
//       />
//     </div>
//   );
// };

// export default Reviews;