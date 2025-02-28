import React from 'react';
import { Users, Map, Award, Heart } from 'lucide-react';

const Stats = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-gray-600">Happy Travelers</div>
          </div>
          
          <div>
            <Map className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">100+</div>
            <div className="text-gray-600">Destinations</div>
          </div>
          
          <div>
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">15+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          
          <div>
            <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;