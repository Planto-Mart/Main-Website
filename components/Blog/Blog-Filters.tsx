import { Search } from "lucide-react";

const BlogFilters = ({ selectedCategory, setSelectedCategory, searchTerm, setSearchTerm }:any) => {
  const categories = [
    { id: 'all', name: 'All Posts', count: 156 },
    { id: 'plant-care', name: 'Plant Care', count: 45 },
    { id: 'indoor-plants', name: 'Indoor Plants', count: 32 },
    { id: 'gardening', name: 'Gardening', count: 28 },
    { id: 'vendor-tips', name: 'Vendor Tips', count: 21 },
    { id: 'seasonal', name: 'Seasonal', count: 18 },
    { id: 'troubleshooting', name: 'Troubleshooting', count: 12 }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Latest Articles</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300 hover:text-green-700'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogFilters;