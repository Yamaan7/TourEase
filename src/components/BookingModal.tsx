import React, { useState } from 'react';
import { Calendar, Users, CreditCard, X } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Swal from 'sweetalert2';
import { saveBookingState } from '../utils/bookingState';

interface BookingModalProps {
  tour: {
    _id: string;
    packageId: string;
    title: string;
    price: number;
  };
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ tour, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    guests: 1,
    specialRequirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('This is a demo. Booking functionality requires backend integration.');
    onClose();
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Now TypeScript knows these properties exist
    saveBookingState(tour._id, tour.packageId);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Book {tour.title}</h2>

        {step === 1 && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Tour Details</h3>
              <p className="text-gray-600">Price per person: ${tour.price}</p>
            </div>

            {/* <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}> */}
            <form onSubmit={handleContinueToPayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    placeholder="Any dietary requirements or special requests?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
              <p className="text-gray-600 mb-4">Total: ${tour.price * formData.guests}</p>

              <div className="space-y-4">
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{
                        description: `Booking for ${tour.title}`,
                        amount: {
                          value: (tour.price * formData.guests).toString(),
                          currency_code: "USD"
                        }
                      }]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order?.capture();
                      await Swal.fire({
                        icon: 'success',
                        title: 'Booking Successful!',
                        text: `Thank you for booking ${tour.title}. Your transaction ID is ${details?.id}`,
                        confirmButtonColor: '#3B82F6',
                      });
                      onClose();
                    } catch (error) {
                      console.error('Payment Error:', error);
                      Swal.fire({
                        icon: 'error',
                        title: 'Payment Failed',
                        text: 'There was an error processing your payment. Please try again.',
                        confirmButtonColor: '#3B82F6',
                      });
                    }
                  }}
                  onError={(err) => {
                    console.error('PayPal Error:', err);
                    Swal.fire({
                      icon: 'error',
                      title: 'Payment Failed',
                      text: 'There was an error processing your payment. Please try again.',
                      confirmButtonColor: '#3B82F6',
                    });
                  }}
                  style={{ layout: "vertical" }}
                />

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;