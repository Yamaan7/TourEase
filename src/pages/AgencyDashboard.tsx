import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, X } from 'lucide-react';
import Swal from 'sweetalert2';
import TourPackageForm from '../components/TourPackageForm';

interface TourPackageStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

// Update the interfaces at the top of the file
interface TourPackage {
    _id?: string;
    packageName: string;
    tourLocation: string;
    packageDescription: string;
    duration: number;
    maxGroupSize: number;
    price: number;
    image: string | null;
    status?: 'pending' | 'approved' | 'rejected';
}

interface Tour {
    _id: string;
    agencyId: string;
    agencyName: string;
    packages: TourPackage[];
    createdAt: string;
}

const AgencyDashboard = () => {
    const navigate = useNavigate();
    const [agency, setAgency] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('tours');
    // Add these near the top of your component with other state declarations
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tourPackages, setTourPackages] = useState<TourPackage[]>([{
        packageName: '',
        tourLocation: '',
        packageDescription: '',
        duration: 1,
        maxGroupSize: 1,
        price: 0,
        image: null
    }]);
    // Update the state declaration
    const [agencyTours, setAgencyTours] = useState<Tour[]>([]); // Changed from TourPackage[] to Tour[]
    const [stats, setStats] = useState<TourPackageStats>({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });
    // Add these new states after other state declarations
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
    const [editingTourId, setEditingTourId] = useState<string>('');

    // Replace the existing useEffect for fetching tours
    useEffect(() => {
        const fetchAgencyTours = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                console.log('Fetching agency tours...'); // Debug log
                const response = await fetch('http://localhost:5000/api/tours/agency', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                console.log('Response status:', response.status); // Debug log

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data); // Debug log

                // Then update the data handling code
                if (Array.isArray(data.tours)) {
                    setAgencyTours(data.tours);
                    const allPackages = data.tours.flatMap((tour: Tour) => tour.packages);
                    setStats({
                        total: allPackages.length,
                        pending: allPackages.filter((pkg: TourPackage) => pkg.status === 'pending').length,
                        approved: allPackages.filter((pkg: TourPackage) => pkg.status === 'approved').length,
                        rejected: allPackages.filter((pkg: TourPackage) => pkg.status === 'rejected').length
                    });
                } else {
                    console.error('Invalid data format:', data);
                    throw new Error('Invalid data format received');
                }
            } catch (error) {
                console.error('Error fetching agency tours:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch tours');
            } finally {
                setLoading(false);
            }
        };

        fetchAgencyTours();
    }, []); // Remove agency dependency, we only need to fetch once on component mount



    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || !localStorage.getItem('isAgency')) {
            navigate('/agencylogin');
            return;
        }
        setAgency(JSON.parse(storedUser));
    }, [navigate]);

    const handlePackageChange = (index: number, field: keyof TourPackage, value: any) => {
        const updatedPackages = [...tourPackages];
        updatedPackages[index] = {
            ...updatedPackages[index],
            [field]: value
        };
        setTourPackages(updatedPackages);
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'File too large',
                    text: 'Image size should be less than 5MB'
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const updatedPackages = [...tourPackages];
                updatedPackages[index] = {
                    ...updatedPackages[index],
                    image: reader.result as string
                };
                setTourPackages(updatedPackages);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTourPackage = () => {
        setTourPackages([...tourPackages, {
            packageName: '',
            tourLocation: '',
            packageDescription: '',
            duration: 1,
            maxGroupSize: 1,
            price: 0,
            image: null
        }]);
    };

    const removeTourPackage = (index: number) => {
        if (tourPackages.length > 1) {
            const updatedPackages = tourPackages.filter((_, i) => i !== index);
            setTourPackages(updatedPackages);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Add status to each package
            const packagesWithStatus = tourPackages.map(pkg => ({
                ...pkg,
                status: 'pending' // Set initial status as pending
            }));

            const response = await fetch('http://localhost:5000/api/tours/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify({ packages: packagesWithStatus })
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Tour packages have been submitted for approval'
                });
                // Reset form
                setTourPackages([{
                    packageName: '',
                    tourLocation: '',
                    packageDescription: '',
                    duration: 1,
                    maxGroupSize: 1,
                    price: 0,
                    image: null,
                    status: 'pending'
                }]);
            } else {
                throw new Error('Failed to create tour packages');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create tour packages. Please try again.'
            });
        }
    };

    // Add delete handler
    const handleDeleteTour = async (tourId: string) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const response = await fetch(`http://localhost:5000/api/tours/${tourId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    setAgencyTours(agencyTours.filter(tour => tour._id !== tourId));
                    Swal.fire('Deleted!', 'Tour package has been deleted.', 'success');
                }
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to delete tour package.', 'error');
        }
    };

    // Add this new handler function after other handlers
    const handleEditClick = (tourId: string, pkg: TourPackage) => {
        setEditingTourId(tourId);
        setEditingPackage(pkg);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPackage || !editingTourId) return;

        try {
            const response = await fetch(`http://localhost:5000/api/tours/${editingTourId}/package/${editingPackage._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(editingPackage)
            });

            if (response.ok) {
                // Update the local state to reflect changes
                const updatedTours = agencyTours.map(tour => {
                    if (tour._id === editingTourId) {
                        return {
                            ...tour,
                            packages: tour.packages.map(pkg =>
                                pkg._id === editingPackage._id ? editingPackage : pkg
                            )
                        };
                    }
                    return tour;
                });

                setAgencyTours(updatedTours);
                setIsEditModalOpen(false);
                setEditingPackage(null);
                setEditingTourId('');

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Tour package has been updated successfully'
                });
            } else {
                throw new Error('Failed to update tour package');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update tour package. Please try again.'
            });
        }
    };

    // Add this handler function after your other handlers
    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'File too large',
                    text: 'Image size should be less than 5MB'
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                if (editingPackage) {
                    setEditingPackage({
                        ...editingPackage,
                        image: reader.result as string
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="container mx-auto px-4 py-8">
                {/* Agency Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-blue-100">
                            <Building className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {agency?.agencyName || 'Agency Dashboard'}
                            </h1>
                            <p className="text-gray-500">Welcome back, {agency?.ownerName}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    {loading ? (
                        <div className="col-span-4 text-center py-4">Loading stats...</div>
                    ) : error ? (
                        <div className="col-span-4 text-red-600 text-center py-4">{error}</div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-700">Total Packages</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-700">Rejected</h3>
                                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Existing Tour Packages */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Your Tour Packages</h2>
                    {loading ? (
                        <div className="text-center py-4">Loading tour packages...</div>
                    ) : error ? (
                        <div className="text-red-600 text-center py-4">{error}</div>
                    ) : agencyTours.length === 0 ? (
                        <div className="text-gray-500 text-center py-4">No tour packages found</div>
                    ) : (
                        // Update the mapping section in your JSX render
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agencyTours.map((tour: Tour) => (
                                tour.packages.map((pkg: TourPackage, index: number) => (
                                    <div key={`${tour._id}-${index}`} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold">{pkg.packageName}</h3>
                                            <span className={`px-2 py-1 rounded text-xs ${pkg.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : pkg.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {pkg.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{pkg.tourLocation}</p>
                                        <p className="text-sm text-gray-600">Duration: {pkg.duration} days</p>
                                        <p className="text-sm text-gray-600">Price: ${pkg.price}</p>
                                        <div className="mt-4 flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditClick(tour._id, pkg)}
                                                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTour(tour._id)}
                                                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ))}
                        </div>
                    )}
                </div>





                {/* Tour Package Form Component */}
                <TourPackageForm
                    tourPackages={tourPackages}
                    onPackageChange={handlePackageChange}
                    onImageChange={handleImageChange}
                    onAddPackage={addTourPackage}
                    onRemovePackage={removeTourPackage}
                    onSubmit={handleSubmit}
                />
            </div>


            {/* Add the Edit Modal component before the closing div of your return statement */}
            {isEditModalOpen && editingPackage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Tour Package</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Package Name</label>
                                <input
                                    type="text"
                                    value={editingPackage.packageName}
                                    onChange={(e) => setEditingPackage({
                                        ...editingPackage,
                                        packageName: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    value={editingPackage.tourLocation}
                                    onChange={(e) => setEditingPackage({
                                        ...editingPackage,
                                        tourLocation: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={editingPackage.packageDescription}
                                    onChange={(e) => setEditingPackage({
                                        ...editingPackage,
                                        packageDescription: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                                    <input
                                        type="number"
                                        value={editingPackage.duration}
                                        onChange={(e) => setEditingPackage({
                                            ...editingPackage,
                                            duration: parseInt(e.target.value)
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Group Size</label>
                                    <input
                                        type="number"
                                        value={editingPackage.maxGroupSize}
                                        onChange={(e) => setEditingPackage({
                                            ...editingPackage,
                                            maxGroupSize: parseInt(e.target.value)
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={editingPackage.price}
                                    onChange={(e) => setEditingPackage({
                                        ...editingPackage,
                                        price: parseInt(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Image upload section */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tour Image
                                </label>
                                <div className="flex items-center space-x-4">
                                    {editingPackage.image && (
                                        <div className="relative w-24 h-24">
                                            <img
                                                src={editingPackage.image}
                                                alt="Tour preview"
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            onChange={handleEditImageChange}
                                            className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                                            accept="image/*"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Max file size: 5MB. Recommended size: 800x600px
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgencyDashboard;