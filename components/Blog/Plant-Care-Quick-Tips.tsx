import { Award, Droplets, Leaf, Sun } from "lucide-react";

const PlantCareQuickTips = () => {
  const tips = [
    { icon: <Droplets className="w-5 h-5" />, tip: "Check soil moisture before watering", color: "text-blue-600" },
    { icon: <Sun className="w-5 h-5" />, tip: "Most plants need 6+ hours of indirect light", color: "text-yellow-600" },
    { icon: <Leaf className="w-5 h-5" />, tip: "Remove dead leaves regularly", color: "text-green-600" }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
      <div className="flex items-center space-x-2 mb-4">
        <Award className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-bold text-gray-800">Quick Tips</h3>
      </div>
      <div className="space-y-3">
        {tips.map((tip, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: not required here
        <div key={index} className="flex items-start space-x-3 p-3 bg-white bg-opacity-70 rounded-lg">
            <div className={tip.color}>
              {tip.icon}
            </div>
            <p className="text-sm text-gray-700">{tip.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantCareQuickTips;