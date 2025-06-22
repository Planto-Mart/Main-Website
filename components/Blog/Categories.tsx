import {Calendar, Leaf, Sprout, Sun, Tag, Users } from "lucide-react";

const Categories = () => {
  const categories = [
    { name: 'Plant Care', count: 45, icon: <Leaf className="w-4 h-4" /> },
    { name: 'Indoor Plants', count: 32, icon: <Sprout className="w-4 h-4" /> },
    { name: 'Gardening', count: 28, icon: <Sun className="w-4 h-4" /> },
    { name: 'Vendor Tips', count: 21, icon: <Users className="w-4 h-4" /> },
    { name: 'Seasonal', count: 18, icon: <Calendar className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Tag className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-bold text-gray-800">Categories</h3>
      </div>
      <div className="space-y-2">
        {categories.map((category, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: not required here
        <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-green-50 cursor-pointer group">
            <div className="flex items-center space-x-2">
              <div className="text-green-600 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <span className="text-gray-700 group-hover:text-green-700">{category.name}</span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {category.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Categories;