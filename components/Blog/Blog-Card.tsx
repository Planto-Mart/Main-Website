import { Calendar, Clock, Eye, Heart, Star, User } from "lucide-react";
import Image from "next/image";

type Category = 'plant-care' | 'indoor-plants' | 'gardening' | 'vendor-tips' | 'seasonal' | 'troubleshooting';

interface BlogPost {
  image: string;
  title: string;
  featured?: boolean;
  category: Category | string;
  date: string;
  readTime: string;
  excerpt: string;
  author: string;
  views: number;
  likes: number;
}

const categoryColors: Record<Category, string> = {
  'plant-care': 'bg-green-100 text-green-800',
  'indoor-plants': 'bg-emerald-100 text-emerald-800',
  'gardening': 'bg-lime-100 text-lime-800',
  'vendor-tips': 'bg-blue-100 text-blue-800',
  'seasonal': 'bg-orange-100 text-orange-800',
  'troubleshooting': 'bg-red-100 text-red-800'
};

const BlogCard = ({ post }: { post: BlogPost }) => {

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <Image
          width={800}
          height={400} 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {post.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Featured</span>
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            (post.category in categoryColors
              ? categoryColors[post.category as Category]
              : 'bg-gray-100 text-gray-800')
          }`}>
            {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{post.author}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};


export default BlogCard;