import { BookOpen, Leaf } from 'lucide-react';

const BlogHeader = () => {
  return (
    <div className="relative bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 py-20">
      {/* Subtle background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-teal-400 rounded-full opacity-30 blur-lg"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center border border-white/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Leaf className="w-3 h-3 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Planto-Mart
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl text-emerald-200 font-medium mb-6">
          Knowledge Hub
        </h2>
        
        {/* Description */}
        <p className="text-lg text-green-100 max-w-2xl mx-auto leading-relaxed">
          Your go-to source for plant wisdom, care guides, and insights from our vibrant community of plant enthusiasts and expert vendors.
        </p>
      </div>
    </div>
  );
};

export default BlogHeader;