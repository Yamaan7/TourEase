import React from 'react';
import PayPalButton from './PayPalButton';
import Swal from 'sweetalert2';

interface TourBookingProps {
    tourPrice: string;
    tourName: string;
}

const TourBooking: React.FC<TourBookingProps> = ({ tourPrice, tourName }) => {
    const handlePaymentSuccess = (details: any) => {
        Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: `Thank you for booking ${tourName}. Your transaction ID is ${details.id}`,
            confirmButtonColor: '#3B82F6',
        });
    };

    const handlePaymentError = (error: any) => {
        Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: 'There was an error processing your payment. Please try again.',
            confirmButtonColor: '#3B82F6',
        });
        console.error('Payment Error:', error);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Book {tourName}</h3>
            <p className="text-gray-600 mb-4">Total Amount: ${tourPrice}</p>
            <PayPalButton
                amount={tourPrice}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
            />
        </div>
    );
};

export default TourBooking;