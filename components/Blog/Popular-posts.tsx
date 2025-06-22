import { Eye, TrendingUp } from "lucide-react";
import Image from "next/image";

const PopularPosts = () => {
  const popularPosts = [
    {
      title: "Why Your Plants Are Dying (And How to Save Them)",
      views: "25.3K",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=60&fit=crop"
    },
    {
      title: "Best Plants for Air Purification",
      views: "18.7K",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=60&fit=crop"
    },
    {
      title: "Starting Your Plant Business in 2024",
      views: "16.2K",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=60&fit=crop"
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-bold text-gray-800">Popular Posts</h3>
      </div>
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey:not required here
        <div key={index} className="flex space-x-3 group cursor-pointer">
            <Image 
              width={100}
              height={60}
              src={post.image} 
              alt={post.title}
              className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                <span>{post.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default PopularPosts;