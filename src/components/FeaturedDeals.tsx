import { Clock, Users, Star } from 'lucide-react';

// Import images
import greekIslands from '../assets/images/deals/greek-islands_9_.webp';
import northernLights from '../assets/images/deals/northern-lights_10_.webp';
import safari from '../assets/images/deals/safari_11_.webp';

const deals = [
  {
    title: "Greek Islands Cruise",
    image: greekIslands,
    originalPrice: 2499,
    discountedPrice: 1999,
    duration: "8 days",
    groupSize: "12-15",
    rating: 4.9,
    reviews: 128,
    discount: 20
  },
  {
    title: "Northern Lights Adventure",
    image: northernLights,
    originalPrice: 1899,
    discountedPrice: 1599,
    duration: "6 days",
    groupSize: "8-10",
    rating: 4.8,
    reviews: 96,
    discount: 15
  },
  {
    title: "Safari Experience",
    image: safari,
    originalPrice: 3299,
    discountedPrice: 2799,
    duration: "10 days",
    groupSize: "6-8",
    rating: 4.9,
    reviews: 156,
    discount: 15
  }
];

const FeaturedDeals = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Limited Time Offers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take advantage of our exclusive deals and save big on your next adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div
              key={deal.title}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative">
                <img
                  loading="lazy"
                  src={deal.image}
                  alt={deal.title}
                  width="400"
                  height="300"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {deal.discount}% OFF
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{deal.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{deal.groupSize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span>{deal.rating} ({deal.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-bold text-blue-600">
                    ${deal.discountedPrice}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ${deal.originalPrice}
                  </span>
                </div>

                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => window.location.href = '/tours'}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;