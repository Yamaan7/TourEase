import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Users, Map, Calendar, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';

interface PendingAgency {
  _id: string;
  agencyName: string;
  description: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  tourPackages: Array<{
    packageName: string;
    packageDescription: string;
    tourLocation: string;
    duration: number;
    maxGroupSize: number;
    price: number;
    image: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
}

interface TourPackage {
  packageName: string;
  packageDescription: string;
  tourLocation: string;
  duration: number;
  maxGroupSize: number;
  price: number;
  image: string;
}

interface PendingTour {
  _id: string;
  agencyId: string;
  agencyName: string;
  packages: TourPackage[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}


const AdminDashboard = () => {
  const [pendingAgencies, setPendingAgencies] = useState<PendingAgency[]>([]);
  const [allAgencies, setAllAgencies] = useState<PendingAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // Add these near your other state declarations
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Add this handler function
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'New password and confirm password do not match'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password has been updated successfully'
        });
        setIsPasswordModalOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update password. Please try again.'
      });
    }
  };

  // Add this near the top of your AdminDashboard component
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');

    console.log('Admin Authentication Check:');
    console.log('Token exists:', !!token);
    console.log('Is Admin:', isAdmin);

    if (!token || !isAdmin) {
      console.log('Redirecting: Missing authentication');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const [pendingTours, setPendingTours] = useState<PendingTour[]>([]);

  useEffect(() => {
    console.log('Component mounted, calling fetchAllData');
    fetchAllData();
  }, []);


  // Add this to your existing fetchAllData function
  const fetchAllData = async () => {
    console.log('Fetching all data...');
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchPendingTours()
      ]);
      console.log('Data fetch complete');
    } catch (err: unknown) {
      console.error('Error in fetchAllData:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTours = async () => {
    try {
      const token = localStorage.getItem('token');
      const isAdmin = localStorage.getItem('isAdmin');

      console.log('Debugging fetchPendingTours:');
      console.log('Token exists:', !!token);
      console.log('Is Admin:', isAdmin);
      console.log('Token value:', token); // Add this to check actual token value

      if (!token || !isAdmin) {
        throw new Error('Admin authentication required');
      }

      const response = await fetch('http://localhost:5000/api/tours/pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('API Response Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries())); // Add this

      const data = await response.json();
      console.log('API Response Data:', JSON.stringify(data, null, 2)); // Pretty print the data

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pending tours');
      }

      if (Array.isArray(data)) {
        setPendingTours(data);
        console.log('Set pending tours:', data.length, 'items');
      } else if (data.tours && Array.isArray(data.tours)) {
        setPendingTours(data.tours);
        console.log('Set pending tours from nested property:', data.tours.length, 'items');
      } else {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error in fetchPendingTours:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tours');
    }
  };

  // Function to fetch all agencies
  // const fetchAllAgencies = async () => {
  //   const token = localStorage.getItem('token');
  //   try {
  //     const response = await fetch('http://localhost:5000/api/agencies/all', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       credentials: 'include'
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch agencies');
  //     }

  //     const data = await response.json();
  //     setAllAgencies(data);
  //   } catch (error) {
  //     console.error('Error fetching agencies:', error);
  //     throw error;
  //   }
  // };

  // useEffect(() => {
  //   fetchPendingAgencies();
  // }, []);

  // Function to fetch pending agencies

  // const fetchPendingAgencies = async () => {
  //   const token = localStorage.getItem('token');
  //   try {
  //     const response = await fetch('http://localhost:5000/api/agencies/pending', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       credentials: 'include'
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch pending agencies');
  //     }

  //     const data = await response.json();
  //     setPendingAgencies(data);
  //   } catch (error) {
  //     console.error('Error fetching pending agencies:', error);
  //     throw error;
  //   }
  // };


  // const handleApproval = async (agencyId: string, status: 'approved' | 'rejected') => {
  //   try {
  //     const token = localStorage.getItem('token');

  //     if (!token) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Authentication Error',
  //         text: 'Please login as admin',
  //         confirmButtonColor: '#3B82F6',
  //       });
  //       return;
  //     }

  //     const response = await fetch(`http://localhost:5000/api/agencies/${agencyId}/status`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({ status })
  //     });

  //     if (response.ok) {
  //       await Swal.fire({
  //         icon: 'success',
  //         title: `Agency ${status === 'approved' ? 'Approved' : 'Rejected'}!`,
  //         text: `The agency has been ${status}.`,
  //         confirmButtonColor: '#3B82F6',
  //       });
  //       fetchPendingAgencies();
  //     } else {
  //       throw new Error('Failed to update agency status');
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Failed to update agency status',
  //       confirmButtonColor: '#3B82F6',
  //     });
  //   }
  // };

  const handleTourApproval = async (tourId: string, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please login as admin',
          confirmButtonColor: '#3B82F6',
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tours/${tourId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          status,
          packageId: tourId // Add this if you're updating individual packages
        })
      });

      // Remove the first JSON parse since we only need it once
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update tour status');
      }

      // After successful update
      await Swal.fire({
        icon: 'success',
        title: `Tour Package ${status === 'approved' ? 'Approved' : 'Rejected'}!`,
        text: `The tour package has been ${status}.`,
        confirmButtonColor: '#3B82F6',
      });

      // Fetch updated tours after successful update
      await fetchPendingTours();

    } catch (err: unknown) {
      console.error('Error updating tour status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tour status';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#3B82F6',
      });
    }
  };


  return (
    <div className="max-w-7xl mx-auto pt-20 my-8"> {/* Added pt-20 for padding-top */}
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Pending Agency Approvals */}
      {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Agency Approvals</h2>
        <div className="grid grid-cols-1 gap-6">
          {pendingAgencies.map((agency) => (
            <div key={agency._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{agency.agencyName}</h3>
                  <p className="text-gray-600">{agency.location}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(agency._id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(agency._id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p><strong>Email:</strong> {agency.email}</p>
                <p><strong>Phone:</strong> {agency.phone}</p>
                <p><strong>Description:</strong> {agency.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Tour Packages ({agency.tourPackages.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agency.tourPackages.map((pkg, index) => (
                      <div key={index} className="border rounded p-3 bg-white">
                        <h5 className="font-semibold">{pkg.packageName}</h5>
                        <p className="text-sm text-gray-600">{pkg.tourLocation}</p>
                        <p className="text-sm text-gray-600">Duration: {pkg.duration} days</p>
                        <p className="text-sm text-gray-600">Price: ${pkg.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {pendingAgencies.length === 0 && (
            <p className="text-gray-500 text-center py-4">No pending agencies to approve</p>
          )}
        </div>
      </div> */}


      {/* Pending Tour Packages */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Tour Packages</h2>
        {loading ? (
          <div className="text-center py-4">Loading pending tours...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingTours.map((tour) => (
              <div key={tour._id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{tour.agencyName}</h3>
                    <p className="text-gray-600">Submitted on: {new Date(tour.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTourApproval(tour._id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleTourApproval(tour._id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.packages.map((pkg, index) => (
                    <div key={index} className="border rounded p-3 bg-white">
                      <h5 className="font-semibold">{pkg.packageName}</h5>
                      <p className="text-sm text-gray-600">{pkg.tourLocation}</p>
                      <p className="text-sm text-gray-600">Duration: {pkg.duration} days</p>
                      <p className="text-sm text-gray-600">Price: ${pkg.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {pendingTours.length === 0 && (
              <p className="text-gray-500 text-center py-4">No pending tour packages to approve</p>
            )}
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;