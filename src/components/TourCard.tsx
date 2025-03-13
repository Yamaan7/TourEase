import React, { lazy, Suspense } from 'react';
import { MapPin, Calendar, Users, DollarSign, Heart } from 'lucide-react';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

// Lazy load modals
const BookingModal = lazy(() => import('./BookingModal'));
const ReviewForm = lazy(() => import('./ReviewForm'));

// Update interface to match Tours.tsx
interface TourCardProps {
  tour: {
    _id: string;
    packageId: string;  // Add this
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
      coordinates: number[];
    };
    rating: number;
    reviews: number;
    agencyName?: string;
    isLiked?: boolean;
    likesCount?: number;
  };
  onReviewSubmitted: () => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onReviewSubmitted }) => {
  const [showBooking, setShowBooking] = React.useState(false);
  const [showReview, setShowReview] = React.useState(false);
  const [isLiked, setIsLiked] = useState(tour.isLiked || false);
  const [likesCount, setLikesCount] = useState(tour.likesCount || 0);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        Swal.fire({
          icon: 'warning',
          title: 'Login Required',
          text: 'Please login to like tours',
          confirmButtonColor: '#3B82F6',
        });
        return;
      }

      const user = JSON.parse(userStr);
      const response = await fetch('http://localhost:5000/api/likes/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Make sure token format is correct
        },
        body: JSON.stringify({
          tourId: tour._id,
          packageId: tour.packageId,
          userId: user._id  // Changed from user.id to user._id to match MongoDB
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle like');
      }

      const data = await response.json();
      setIsLiked(data.liked);
      setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
    } catch (err) {
      // Type the error properly
      const error = err as Error;
      console.error('Error toggling like:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to toggle like',
        confirmButtonColor: '#3B82F6',
      });
    }
  };

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
          {/* <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-semibold">{tour.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({tour.reviews})</span>
          </div> */}
          {tour.agencyName && (
            <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full shadow-md">
              <span className="text-sm text-gray-700">By {tour.agencyName}</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{tour.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">
            {tour.description}
          </p>

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
              <span>${tour.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* <span className={`px-3 py-1 rounded-full text-sm ${tour.difficulty === 'easy'
              ? 'bg-green-100 text-green-800'
              : tour.difficulty === 'medium'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-orange-100 text-orange-800'
              }`}>
              {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
            </span> */}

            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
              <span className="text-gray-600">{likesCount}</span>
            </button>

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
          <ReviewForm
            tourTitle={tour.title}
            tourId={tour._id}
            packageId={tour.packageId} // Add this
            onClose={() => setShowReview(false)}
            onReviewSubmitted={onReviewSubmitted}
          />
        )}
      </Suspense>
    </>
  );
};

export default TourCard;