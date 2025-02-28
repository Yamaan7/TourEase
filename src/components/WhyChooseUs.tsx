import React from 'react';
import { Shield, Clock, DollarSign, HeartHandshake, Award, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "100% Secure Booking",
    description: "Your payment and personal information are always protected"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance for any travel-related queries"
  },
  {
    icon: DollarSign,
    title: "Best Price Guarantee",
    description: "We match any competitor's price for the same tour package"
  },
  {
    icon: HeartHandshake,
    title: "Expert Local Guides",
    description: "Knowledgeable guides who know their destinations inside out"
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "All tours are thoroughly vetted for quality and safety"
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Personal travel consultant for a seamless experience"
  }
];

const WhyChooseUs = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose TourEase?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to making your travel experience exceptional from start to finish
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;