import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Swal from 'sweetalert2';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show success message with SweetAlert2
    await Swal.fire({
      icon: 'success',
      title: 'Successfully Subscribed!',
      text: 'Thank you for subscribing to our newsletter.',
      confirmButtonColor: '#3B82F6',
      confirmButtonText: 'Great!',
    });

    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-8">
            Get exclusive travel tips, destination guides, and special offers delivered directly to your inbox.
          </p>

          {subscribed ? (
            <div className="bg-blue-500 p-4 rounded-lg">
              <p className="text-lg">Thank you for subscribing! 🎉</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-lg text-gray-900 w-full sm:w-96"
                required
              />
              <button
                type="submit"
                className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
              >
                Subscribe
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;