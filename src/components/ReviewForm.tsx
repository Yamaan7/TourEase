import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Swal from 'sweetalert2';
import { hasUserBooked } from '../utils/bookingState';

interface ReviewFormProps {
  onClose: () => void;
  tourTitle: string;
  tourId: string;
  packageId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onClose,
  tourTitle,
  tourId,
  packageId,  // Add this to destructuring
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user has already reviewed
  useEffect(() => {
    const checkReviewStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          `http://localhost:5000/api/reviews/check/${tourId}/${packageId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) throw new Error('Failed to check review status');
        const data = await response.json();

        if (data.hasReviewed) {
          Swal.fire({
            icon: 'info',
            title: 'Already Reviewed',
            text: 'You have already submitted a review for this tour package',
            confirmButtonColor: '#3B82F6',
          }).then(() => {
            onClose();
          });
        }
      } catch (error) {
        console.error('Error checking review status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkReviewStatus();
  }, [tourId, packageId, onClose]);

  // Prevent form submission while loading
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user has booked this tour
    // Replace the existing Swal.fire call in handleSubmit
    if (!hasUserBooked(tourId, packageId)) {
      Swal.fire({
        icon: 'warning',
        title: 'Booking Required',
        text: 'You need to book this tour before submitting a review',
        confirmButtonColor: '#3B82F6',
        confirmButtonText: 'OK',
      }).then(() => {
        onClose();
      });
      return;
    }

    setSubmitting(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not logged in');
      const user = JSON.parse(userStr);

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          tourId,
          packageId,
          rating,
          review,
          userId: user.id,
          userName: user.name
        })
      });

      if (!response.ok) throw new Error('Failed to submit review');

      // Get the updated package data with new rating
      const updatedData = await response.json();

      await Swal.fire({
        icon: 'success',
        title: 'Review Submitted',
        text: 'Thank you for your feedback!',
        confirmButtonColor: '#3B82F6',
      });

      // Pass the updated data to the parent component
      onReviewSubmitted();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit review. Please try again.',
        confirmButtonColor: '#3B82F6',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Review {tourTitle}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    className={`w-8 h-8 ${star <= (hover || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 ${submitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-3 rounded-lg transition-colors`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;