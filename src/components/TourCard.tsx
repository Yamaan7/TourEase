import React, { lazy, Suspense } from 'react';
import { MapPin, Calendar, Users, DollarSign, Star } from 'lucide-react';

// Lazy load modals
const BookingModal = lazy(() => import('./BookingModal'));
const ReviewForm = lazy(() => import('./ReviewForm'));

interface TourCardProps {
  tour: {
    title: string;
    description: string;
    price: number;
    duration: number;
    maxGroupSize: number;
    difficulty: string;
    images: string[];
    startDates: Date[];
    location: {
      address: string;
    };
    rating?: number;
    reviews?: number;
  };
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const [showBooking, setShowBooking] = React.useState(false);
  const [showReview, setShowReview] = React.useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img
            src={tour.images[0] || 'https://images.unsplash.com/photo-1500835556837-99ac94a94552'}
            alt={tour.title}
            className="w-full h-48 sm:h-56 object-cover"
            loading="lazy"
          />
          {tour.rating && (
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold">{tour.rating}</span>
              {tour.reviews && (
                <span className="text-sm text-gray-500">({tour.reviews})</span>
              )}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{tour.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{tour.description}</p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-500 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="truncate max-w-[150px]">{tour.location.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{tour.duration} days</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-500 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{tour.maxGroupSize} people</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span>{tour.price}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {tour.difficulty}
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowReview(true)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Review
              </button>
              <button
                onClick={() => setShowBooking(true)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        {showBooking && (
          <BookingModal tour={tour} onClose={() => setShowBooking(false)} />
        )}

        {showReview && (
          <ReviewForm tourTitle={tour.title} onClose={() => setShowReview(false)} />
        )}
      </Suspense>
    </>
  );
};

export default TourCard;