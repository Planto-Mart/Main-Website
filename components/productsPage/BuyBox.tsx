import React from 'react'
import { MinusCircle, PlusCircle, Heart, ShieldCheck, Truck, MapPin, Store, Leaf, Award } from 'lucide-react'
import Link from 'next/link'
import ProductDataType from '@/types/ProductData'
import { useState } from 'react'

type VendorData = {
  name?: string
  business_name?: string
  slug: string
  is_verified?: number
}

type BuyBoxProps = {
  product: ProductDataType
  vendorData?: VendorData
  quantity: number
  onQuantityChange: (increment: boolean) => void
  onAddToCart: () => void
  // onBuyNow: () => void
  onAddToWishlist: () => void
  inputId?: string
  deliveryDate?: string
  sellerName?: string
  pricePerUnit?: number;
}

// Utility for Indian currency formatting
const formatIndianPrice = (price: number): string =>
  price.toLocaleString('en-IN')

const BuyBox: React.FC<BuyBoxProps> = ({
  product,
  vendorData,
  quantity,
  onQuantityChange,
  onAddToCart,
  // onBuyNow,
  onAddToWishlist,
  inputId = 'quantity-input',
  deliveryDate = 'Tuesday, 27 May',
  sellerName = 'PlantoMart',
}) => {
  const { price, discountPrice, discountPercent, quantity: stockQty, brand } = product

    const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate the current effective price per unit
  const pricePerUnit = discountPrice ?? price
  const originalPricePerUnit = price
  
  // Calculate total prices based on quantity
  const totalPrice = pricePerUnit * quantity
  const totalOriginalPrice = originalPricePerUnit * quantity
  const totalSavings = discountPrice ? (totalOriginalPrice - totalPrice) : 0

  const handlePayment = async (amount: number, productName: string) => {
    if (amount <= 0) return;

    setIsProcessing(true);

    try {
      // Create order directly
      const res = await fetch('/api/razorpay/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount * 100 }),
      });
      
      const data = await res.json();
      
      // Setup Razorpay payment
      const PaymentData = {
        key: process.env.RAZORPAY_LIVE_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "payNex",
        description: "Payment testing or support",
        order_id: data.id,
        
        handler: async function (response: any) {
          // Verify payment
          const res = await fetch("/api/razorpay/verifyOrder", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          
          const data = await res.json();
          
          if (data.isOk) {
            // Payment successful - 
            alert("Payment successful!");
          } else {
            alert("Payment failed");
          }
        },
        prefill: {
          name: "payNex",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      // Check if Razorpay is loaded
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const payment = new (window as any).Razorpay(PaymentData);
        payment.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }
      
      // Reset processing state after Razorpay modal opens
      setIsProcessing(false);
        
    } catch (error) {
        console.error("Payment error:", error);
        alert("There was an error processing your payment. Please try again.");
        setIsProcessing(false);
    }
    
  };

  return (
    <div className="lg:col-span-3">
      <div className="sticky top-24 overflow-hidden rounded-2xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
        {/* Header with nature theme */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5" />
              <span className="font-semibold">PlantoMart</span>
            </div>
            {vendorData?.is_verified === 1 && (
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Price Section with quantity adjustment */}
          <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">₹{formatIndianPrice(totalPrice)}</span>
                  <span className="text-sm font-medium text-green-600">
                    (₹{formatIndianPrice(pricePerUnit)} each)
                  </span>
                </div>
                {discountPrice !== undefined && (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      ₹{formatIndianPrice(totalOriginalPrice)}
                    </span>
                    {discountPercent && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        Save {discountPercent}% • ₹{formatIndianPrice(totalSavings)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">FREE delivery by</span>
              <span className="font-semibold text-green-700">{deliveryDate}</span>
            </div>
          </div>

          {/* Stock Status with visual indicator */}
          <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${stockQty > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${stockQty > 0 ? 'text-green-700' : 'text-red-600'}`}>
                {stockQty > 0 ? `In stock (${stockQty} available)` : 'Out of stock'}
              </span>
            </div>
            {stockQty > 0 && stockQty <= 5 && (
              <span className="text-xs text-orange-600 font-medium">Only {stockQty} left!</span>
            )}
          </div>

          {/* Enhanced Quantity Selector */}
          <div className="mb-6">
            <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-gray-700">
              Quantity:
            </label>
            <div className="flex items-center justify-center rounded-lg bg-white p-3 shadow-sm">
              <button
                type="button"
                onClick={() => onQuantityChange(false)}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              
              <div className="mx-4 flex flex-col items-center">
                <input
                  type="text"
                  id={inputId}
                  value={quantity}
                  readOnly
                  className="w-16 border-0 bg-transparent text-center text-xl font-bold text-gray-900"
                />
                <span className="text-xs text-gray-500">items</span>
              </div>
              
              <button
                type="button"
                onClick={() => onQuantityChange(true)}
                disabled={quantity >= stockQty}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 transition-all hover:bg-green-200 hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={onAddToCart}
              disabled={stockQty <= 0}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 py-4 text-lg font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:animate-pulse group-hover:opacity-20" />
              <span className="relative flex items-center justify-center space-x-2">
                <span className="text-xl">🛒</span>
                <span>Add to Cart</span>
              </span>
            </button>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={() => handlePayment(Math.round(pricePerUnit * quantity), product.title)}
              disabled={stockQty <= 0}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:animate-pulse group-hover:opacity-20" />
              <span className="relative flex items-center justify-center space-x-2">
                <span className="text-xl">⚡</span>
                <span>Buy Now</span>
              </span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={onAddToWishlist}
              className="group flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-gray-200 bg-white py-4 text-base font-medium text-gray-700 transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
            >
              <Heart className="h-5 w-5 transition-colors group-hover:text-pink-500" />
              <span>Add to Wishlist</span>
            </button>
          </div>

          {/* Enhanced Shipping and Security Info */}
          <div className="mt-6 space-y-4">
            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 rounded-lg bg-blue-50 p-3 text-blue-700">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">100% Secure Transaction</span>
            </div>

            {/* Shipping Information */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h4 className="mb-3 flex items-center space-x-2 text-sm font-semibold text-gray-800">
                <MapPin className="h-4 w-4 text-green-600" />
                <span>Shipping Information</span>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ships from:</span>
                  <span className="font-medium text-gray-800">{sellerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sold by:</span>
                  {vendorData ? (
                    <Link 
                      href={`/vendor/store/${vendorData.slug}`}
                      className="flex items-center space-x-1 font-medium text-green-600 hover:text-green-700 hover:underline"
                    >
                      <Store className="h-3 w-3" />
                      <span>{vendorData.name || vendorData.business_name || brand}</span>
                      {vendorData.is_verified === 1 && (
                        <Award className="h-3 w-3 text-blue-500" />
                      )}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-800">{brand}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Nature-themed guarantee */}
            <div className="rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 p-3">
              <div className="flex items-center space-x-2 text-green-800">
                <Leaf className="h-4 w-4" />
                <span className="text-xs font-medium">🌱 Healthy Plant Guarantee • 🚚 Safe Packaging • 💚 Eco-Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyBox;