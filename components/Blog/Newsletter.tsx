"use client";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e:any) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white bg-opacity-10 p-3 rounded-full w-fit mx-auto mb-6">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Stay Updated with Plant Wisdom
        </h2>
        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
          Get weekly plant care tips, vendor success stories, and exclusive content 
          delivered straight to your inbox.
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button
              type='button'
              onClick={handleSubmit}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Subscribe
            </button>
          </div>
          <p className="text-green-200 text-sm mt-3">
            Join 10,000+ plant enthusiasts and vendors!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;