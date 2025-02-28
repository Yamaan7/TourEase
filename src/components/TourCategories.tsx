import React from 'react';
import { Mountain, Palmtree, Building, Compass, Tent, Ship, Camera, Wine } from 'lucide-react';

const categories = [
  {
    name: "Adventure Tours",
    icon: Mountain,
    description: "Thrilling experiences for adrenaline seekers",
    count: 45,
    color: "bg-orange-100 text-orange-700"
  },
  {
    name: "Beach Getaways",
    icon: Palmtree,
    description: "Relax on the world's most beautiful beaches",
    count: 32,
    color: "bg-blue-100 text-blue-700"
  },
  {
    name: "City Breaks",
    icon: Building,
    description: "Explore vibrant cities and culture",
    count: 56,
    color: "bg-purple-100 text-purple-700"
  },
  {
    name: "Hiking Tours",
    icon: Compass,
    description: "Discover scenic trails and nature",
    count: 28,
    color: "bg-green-100 text-green-700"
  },
  {
    name: "Camping",
    icon: Tent,
    description: "Connect with nature under the stars",
    count: 24,
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    name: "Cruises",
    icon: Ship,
    description: "Sail to amazing destinations",
    count: 18,
    color: "bg-cyan-100 text-cyan-700"
  },
  {
    name: "Photography",
    icon: Camera,
    description: "Capture stunning moments worldwide",
    count: 15,
    color: "bg-pink-100 text-pink-700"
  },
  {
    name: "Food & Wine",
    icon: Wine,
    description: "Taste culinary delights globally",
    count: 22,
    color: "bg-red-100 text-red-700"
  }
];

const TourCategories = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Tour Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover your perfect adventure from our diverse range of carefully curated tour categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className={`inline-block p-3 rounded-lg ${category.color} mb-4`}>
                <category.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {category.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{category.count} tours</span>
                <span className="text-blue-600 text-sm font-medium">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourCategories;