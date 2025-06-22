import { ArrowRight, Eye, Heart, User } from "lucide-react";
import Image from "next/image";

const FeaturedPost = () => {
  const featuredPost = {
    title: "The Ultimate Guide to Indoor Plant Care for Beginners",
    excerpt: "Transform your home into a green oasis with our comprehensive guide covering everything from light requirements to watering schedules.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    author: "Sarah Green",
    date: "2 days ago",
    readTime: "12 min read",
    category: "Plant Care",
    views: "15.2K",
    likes: "2.1K"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-green-100">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative overflow-hidden">
            <Image
              width={800}
              height={400} 
              src={featuredPost.image} 
              alt={featuredPost.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {featuredPost.category}
              </span>
              <span className="text-gray-500 text-sm">{featuredPost.readTime}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
              {featuredPost.title}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{featuredPost.author}</div>
                  <div className="text-sm text-gray-500">{featuredPost.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{featuredPost.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{featuredPost.likes}</span>
                </div>
              </div>
            </div>
            <button type="button" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 w-fit">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;