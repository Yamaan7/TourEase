import React from 'react';
import { Star, X } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
    userName: string;
    rating: number;
    review: string;
    createdAt: string;
}

interface ReviewsModalProps {
    tourTitle: string;
    reviews: Review[];
    onClose: () => void;
    onAddReview: () => void;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({
    tourTitle,
    reviews,
    onClose,
    onAddReview
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full h-[90vh] sm:h-[80vh] flex flex-col">
                <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 flex-shrink-0">
                        <h2 className="text-2xl font-bold">Reviews for {tourTitle}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Add Review Button */}
                    <button
                        onClick={onAddReview}
                        className="w-full mb-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex-shrink-0"
                    >
                        Write a Review
                    </button>

                    {/* Reviews List - This div will scroll */}
                    <div className="overflow-y-auto flex-1 -mx-6 px-6">
                        {reviews.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No reviews yet. Be the first to review!
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review, index) => (
                                    <div
                                        key={index}
                                        className="border-b pb-6 last:border-b-0"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold">{review.userName}</h3>
                                                <div className="flex gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= review.rating
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{review.review}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsModal;