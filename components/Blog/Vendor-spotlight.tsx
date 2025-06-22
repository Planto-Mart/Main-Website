import { Star, Users } from "lucide-react";

const VendorSpotlight = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-bold text-gray-800">Vendor Spotlight</h3>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="w-8 h-8 text-green-600" />
        </div>
        <h4 className="font-semibold text-gray-800 mb-1">Green Paradise Nursery</h4>
        <p className="text-sm text-gray-600 mb-3">
          Specializing in rare indoor plants and expert care advice.
        </p>
        <div className="flex justify-center space-x-4 text-xs text-gray-500 mb-4">
          <span>⭐ 4.9 Rating</span>
          <span>📦 1.2K Orders</span>
        </div>
        <button type='button' className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors w-full">
          Visit Store
        </button>
      </div>
    </div>
  );
};

export default VendorSpotlight;