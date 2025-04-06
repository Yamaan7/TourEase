import React, { lazy, Suspense } from 'react';
import { MapPin, Calendar, Users, DollarSign, Heart, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

// Lazy load modals
const BookingModal = lazy(() => import('./BookingModal'));
const ReviewForm = lazy(() => import('./ReviewForm'));
const ReviewsModal = lazy(() => import('./ReviewsModal'));

interface TourCardProps {
  tour: {
    _id: string;
    packageId: string;
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

interface Review {
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
}


const TourCard: React.FC<TourCardProps> = ({ tour, onReviewSubmitted }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(Math.max(0, tour.likesCount || 0));
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch reviews function
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(
        `http://localhost:5000/api/reviews/${tour._id}/${tour.packageId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched reviews:', data);
      setReviews(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Also add an initial fetch when component mounts
  useEffect(() => {
    fetchReviews();
  }, [tour._id, tour.packageId]);

  // Review button click handler
  const handleReviewClick = async () => {
    await fetchReviews();
    setShowReviews(true);
  };



  // Fetch initial likes count when component mounts
  useEffect(() => {
    const fetchInitialLikes = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/likes/totalLikes/${tour._id}/${tour.packageId}`
        );
        const data = await response.json();
        setLikesCount(Math.max(0, data.totalLikes));
      } catch (error) {
        console.error('Error fetching initial likes:', error);
      }
    };

    fetchInitialLikes();
  }, [tour._id, tour.packageId]);

  // Check if current user has liked the tour
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          const response = await fetch(
            `http://localhost:5000/api/likes/status/${tour._id}/${tour.packageId}/${user._id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          const data = await response.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [tour._id, tour.packageId]);

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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tourId: tour._id,
          packageId: tour.packageId,
          userId: user._id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle like');
      }

      setIsLiked(data.liked);
      setLikesCount(Math.max(0, data.totalLikes));

    } catch (err) {
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

  const handleBooking = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to book this tour',
        confirmButtonColor: '#3B82F6',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }

    setShowBooking(true);
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
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-semibold">
              {tour.rating > 0 ? tour.rating.toFixed(1) : 'New'}
            </span>
            <span className="text-sm text-gray-500">
              ({tour.reviews})
            </span>
          </div>
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
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
              <span className="text-gray-600">{Math.max(0, likesCount)}</span>
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleReviewClick}
                className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Reviews
              </button>
              <button
                onClick={handleBooking}
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
          <BookingModal
            tour={tour}
            onClose={() => setShowBooking(false)}
          />
        )}
        {showReviews && (
          <ReviewsModal
            tourTitle={tour.title}
            reviews={reviews}
            onClose={() => setShowReviews(false)}
            onAddReview={() => {
              setShowReviews(false);
              setShowReview(true);
            }}
          />
        )}
        {showReview && (
          <ReviewForm
            tourTitle={tour.title}
            tourId={tour._id}
            packageId={tour.packageId}
            onClose={() => setShowReview(false)}
            onReviewSubmitted={() => {
              onReviewSubmitted();
              fetchReviews();
              setShowReview(false);
              setShowReviews(true);
            }}
          />
        )}
      </Suspense>
    </>
  );
};

export default TourCard;