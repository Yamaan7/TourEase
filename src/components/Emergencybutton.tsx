import React from 'react';
import { PhoneCall } from 'lucide-react';
import Swal from 'sweetalert2';

const EmergencyButton = () => {
  const handleEmergency = async () => {
    try {
      const token = localStorage.getItem('token');

      // First show emergency contacts
      const result = await Swal.fire({
        title: '<span class="text-red-600 font-bold text-xl">🚨 Emergency Contacts</span>',
        html: `
        <div class="space-y-4 p-2">
          <div class="text-left space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-4">
              <p class="font-semibold text-gray-800 flex items-center">👮‍♂️ Police Emergency</p>
              <a href="tel:100" class="w-full sm:w-36 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-center font-medium shadow-md transition-colors flex items-center justify-center gap-2">
                <span>Call 100</span>
              </a>
            </div>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-4">
              <p class="font-semibold text-gray-800 flex items-center">🚑 Medical Emergency</p>
              <a href="tel:102" class="w-full sm:w-36 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-center font-medium shadow-md transition-colors flex items-center justify-center gap-2">
                <span>Call 102</span>
              </a>
            </div>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-4">
              <p class="font-semibold text-gray-800 flex items-center">🏥 Tourist Helpline</p>
              <a href="tel:1363" class="w-full sm:w-36 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-center font-medium shadow-md transition-colors flex items-center justify-center gap-2">
                <span>Call 1363</span>
              </a>
            </div>
          </div>
          <div class="mt-6 text-sm text-gray-600 bg-red-50 p-4 rounded-lg border border-red-100">
            <p class="font-medium text-red-800">⚠️ Emergency Notice</p>
            <p class="mt-1">Contact emergency services immediately if needed, or notify your travel agency.</p>
          </div>
        </div>
        `,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Notify Agency →',
        confirmButtonColor: '#ef4444',
        cancelButtonText: 'Close',
        cancelButtonColor: '#4B5563',
      });

      // Only proceed if user clicked 'Notify Agency'
      if (!result.isConfirmed) {
        return;
      }

      // If user clicks to notify agency
      const { value: formValues } = await Swal.fire({
        title: 'Emergency Contact Form',
        html: `
          <input 
            id="swal-input-name" 
            class="swal2-input" 
            placeholder="Your Name"
          >
          <input 
            id="swal-input-tour" 
            class="swal2-input" 
            placeholder="Tour Package or Location"
          >
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Send Alert',
        confirmButtonColor: '#EF4444',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
          const tourPackage = (document.getElementById('swal-input-tour') as HTMLInputElement).value;

          if (!name || !tourPackage) {
            Swal.showValidationMessage('Please fill in all fields');
            return false;
          }

          return { name, tourPackage };
        }
      });

      if (!formValues) return;

      if (!token) {
        throw new Error('Please login to notify the agency');
      }

      // Send emergency alert with auth token
      const response = await fetch('http://localhost:5000/api/emergency/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formValues.name,
          tourPackage: formValues.tourPackage
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to send emergency alert');
      }

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Emergency Alert Sent',
        text: 'Help is on the way. Stay calm.',
        confirmButtonColor: '#3B82F6',
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to send emergency alert. Please try calling emergency services directly.',
        confirmButtonColor: '#3B82F6',
      });
    }
  };

  return (
    <button
      onClick={handleEmergency}
      className="fixed right-4 bottom-20 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 
                shadow-[0_0_15px_rgba(239,68,68,0.5)] border-2 border-white 
                flex items-center justify-center transition-all duration-300 hover:scale-105 
                animate-pulse hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]"
      aria-label="Emergency Contact"
    >
      <PhoneCall className="w-6 h-6" />
    </button>
  );
};

export default EmergencyButton;