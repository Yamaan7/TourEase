import { lazy, Suspense, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import TourCard from '../components/TourCard';


import parisImg from '../assets/images/destinations/paris_3_.webp';
import romeImg from '../assets/images/destinations/rome_4_.webp';
import tokyoImg from '../assets/images/destinations/tokyo_5_.webp';

// Lazy load the map component
const TourMap = lazy(() => import('../components/TourMap'));

// Example tour data (in a real app, this would come from an API)
const exampleTours = [
  {
    title: "Explore Ancient Rome",
    description: "Walk through the historic streets of Rome, visit the Colosseum, and experience the rich history of the Roman Empire.",
    price: 199,
    duration: 3,
    maxGroupSize: 15,
    difficulty: "medium",
    images: [romeImg],
    startDates: [new Date()],
    location: {
      address: "Rome, Italy",
      coordinates: [12.4964, 41.9028]
    },
    rating: 4.8,
    reviews: 124
  },
  {
    title: "Paris Discovery Tour",
    description: "Experience the magic of Paris with guided tours of the Eiffel Tower, Louvre Museum, and charming Montmartre district.",
    price: 249,
    duration: 4,
    maxGroupSize: 12,
    difficulty: "easy",
    images: [parisImg],
    startDates: [new Date()],
    location: {
      address: "Paris, France",
      coordinates: [2.3522, 48.8566]
    },
    rating: 4.9,
    reviews: 89
  },
  {
    title: "Tokyo Adventure",
    description: "Immerse yourself in Japanese culture, visit ancient temples, and explore modern Tokyo's vibrant districts.",
    price: 299,
    duration: 5,
    maxGroupSize: 10,
    difficulty: "medium",
    images: [tokyoImg],
    startDates: [new Date()],
    location: {
      address: "Tokyo, Japan",
      coordinates: [139.6503, 35.6762]
    },
    rating: 4.7,
    reviews: 156
  }
];

const Tours = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedTour, setSelectedTour] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    priceRange: '',
    duration: '',
    groupSize: ''
  });

  const locations = exampleTours.map(tour => ({
    coordinates: tour.location.coordinates as [number, number],
    name: tour.title,
    description: tour.location.address
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 mt-16"> {/* Added mt-16 here */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Available Tours</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg ${viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg ${viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
            >
              Map View
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="difficult">Difficult</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prices</option>
                <option value="0-100">$0 - $100</option>
                <option value="101-300">$101 - $300</option>
                <option value="301+">$301+</option>
              </select>

              <select
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Durations</option>
                <option value="1-3">1-3 days</option>
                <option value="4-7">4-7 days</option>
                <option value="8+">8+ days</option>
              </select>

              <select
                value={filters.groupSize}
                onChange={(e) => setFilters({ ...filters, groupSize: e.target.value })}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Group Sizes</option>
                <option value="1-5">1-5 people</option>
                <option value="6-10">6-10 people</option>
                <option value="11+">11+ people</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={viewMode === 'map' ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exampleTours.map((tour, index) => (
              <div
                key={index}
                onMouseEnter={() => setSelectedTour(index)}
                onMouseLeave={() => setSelectedTour(null)}
              >
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        </div>

        {viewMode === 'map' && (
          <div className="lg:col-span-1 h-[calc(100vh-200px)] sticky top-8">
            <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />}>
              <TourMap
                locations={locations}
                center={selectedTour !== null ? locations[selectedTour].coordinates : undefined}
                zoom={selectedTour !== null ? 12 : 3}
                className="h-full w-full rounded-lg overflow-hidden shadow-lg"
              />
            </Suspense>
          </div>
        )}
      </div>

    </div>
  );
};

export default Tours;