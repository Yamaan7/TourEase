import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, CreditCard, Search, ChevronRight } from 'lucide-react';


// Lazy load components that are not immediately visible
const Stats = lazy(() => import('../components/Stats'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Newsletter = lazy(() => import('../components/Newsletter'));
const TourCategories = lazy(() => import('../components/TourCategories'));
const FeaturedDeals = lazy(() => import('../components/FeaturedDeals'));
const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));

// Import images
import heroBg from '../assets/images/destinations/hero-bg_.webp';
import parisImg from '../assets/images/destinations/paris_3_.webp';
import romeImg from '../assets/images/destinations/rome_4_.webp';
import tokyoImg from '../assets/images/destinations/tokyo_5_.webp';
import barcelonaImg from '../assets/images/destinations/barcelona_2_.webp';

const popularDestinations = [
  {
    name: "Paris",
    country: "France",
    image: parisImg,
    tours: 15
  },
  {
    name: "Rome",
    country: "Italy",
    image: romeImg,
    tours: 12
  },
  {
    name: "Tokyo",
    country: "Japan",
    image: tokyoImg,
    tours: 18
  },
  {
    name: "Barcelona",
    country: "Spain",
    image: barcelonaImg,
    tours: 10
  }
];

const LoadingFallback = () => (
  <div className="h-48 flex items-center justify-center">
    <div className="animate-pulse text-gray-500">Loading...</div>
  </div>
);

const Home = () => {
  return (
    <>
      {/* Hero Section - Keep outside Suspense for immediate loading */}
      <div className="relative bg-gray-900 text-white py-24 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <img
            loading="eager"
            src={heroBg}
            alt="Travel Background"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Tours Around the World
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Book unique travel experiences with local guides and create memories that last a lifetime
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/tours"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                <Search className="mr-2" />
                Explore Tours
              </Link>
              <Link
                to="/learn-more"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
              >
                Learn More
                <ChevronRight className="ml-2" />
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg font-semibold"
              >
                Admin Dashboard
                <ChevronRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Wrap components below the fold in Suspense */}
      <Suspense fallback={<LoadingFallback />}>
        <FeaturedDeals />
        <TourCategories />

        {/* How It Works Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Choose Destination</h3>
                <p className="text-gray-600">
                  Select from hundreds of exciting destinations worldwide
                </p>
              </div>
              <div className="text-center p-6">
                <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pick Date</h3>
                <p className="text-gray-600">
                  Find the perfect time for your next adventure
                </p>
              </div>
              <div className="text-center p-6">
                <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Book Instantly</h3>
                <p className="text-gray-600">
                  Secure your spot with easy online booking
                </p>
              </div>
            </div>
          </div>
        </div>

        <WhyChooseUs />
        <Stats />

        {/* Popular Destinations */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularDestinations.map((destination) => (
                <div key={destination.name} className="group relative rounded-lg overflow-hidden shadow-md">
                  <img
                    loading="lazy"
                    src={destination.image}
                    alt={destination.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <p className="text-sm mb-2">{destination.country}</p>
                    <p className="text-sm">{destination.tours} tours</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Testimonials />
        <Newsletter />
      </Suspense>
    </>
  );
};

export default Home;