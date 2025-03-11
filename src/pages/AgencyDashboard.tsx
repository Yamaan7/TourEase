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
        </div>
    );
};

export default AgencyDashboard;