import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Calendar, MapPin, CreditCard, Settings, LogOut, Heart } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Star } from 'lucide-react';

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
}

interface TourPackage {
    _id: string;
    packageName: string;
    name: string;
    image: string;
    price: number;
    duration: number;
    tourLocation: string;
}

interface Like {
    _id: string;
    tourId: string;
    packageId: string;
    createdAt: string;
    package?: TourPackage;
    tourTitle: string;
}

interface Review {
    _id: string;
    tourId: string;
    packageId: string;
    rating: number;
    review: string;
    createdAt: string;
    package?: TourPackage;
    tourTitle: string;
}
interface DashboardStats {
    upcomingTours: number;
    completedTours: number;
    savedDestinations: number;
    totalSpent: number;
    likedTours: Like[];
    reviews: Review[];
}

const Dashboard = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (!userStr || !token) {
                    throw new Error('User not authenticated');
                }

                const user = JSON.parse(userStr);
                setUserData(user);

                console.log('Fetching user stats...'); // Debug log
                const response = await fetch(`http://localhost:5000/api/users/stats/${user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to fetch user stats');
                }

                const data = await response.json();
                console.log('Received user stats:', data); // Debug log

                setStats({
                    ...data,
                    likedTours: data.likedTours?.map((like: Like) => ({
                        ...like,
                        package: like.package || {
                            _id: '',
                            packageName: 'Unavailable',
                            image: '/placeholder-image.jpg'
                        }
                    })) || [],
                    reviews: data.reviews || []
                });
            } catch (error) {
                console.error('Dashboard error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load dashboard data',
                    confirmButtonColor: '#3B82F6'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (!localStorage.getItem('token')) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const renderPackageInfo = (pkg: TourPackage | undefined, date: string) => {
        if (!pkg) {
            return (
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div>
                        <h3 className="font-medium">Package unavailable</h3>
                        <p className="text-sm text-gray-500">
                            {new Date(date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex items-center space-x-4">
                <img
                    src={pkg.image || '/placeholder-image.jpg'}
                    alt={pkg.packageName}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.jpg';
                    }}
                />
                <div>
                    <h3 className="font-medium">{pkg.packageName}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                        {pkg.duration} days • ${pkg.price}
                    </p>
                    <p className="text-sm text-gray-600">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {pkg.tourLocation}
                    </p>
                </div>
            </div>
        );
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChange'));
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Welcome, {userData?.name}
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Info Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{userData?.name}</h3>
                            <p className="text-gray-500">{userData?.email}</p>
                            {userData?.phone && (
                                <p className="text-gray-500">{userData.phone}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Liked Tours */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Heart className="w-5 h-5 mr-2 text-red-500" />
                                Liked Tours
                            </h2>
                            {stats?.likedTours?.length ? (
                                <div className="space-y-4">
                                    {stats.likedTours.map((like) => (
                                        <div key={like._id}>
                                            {like.package && renderPackageInfo(like.package, like.createdAt)}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No liked tours yet</p>
                            )}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                                Your Reviews
                            </h2>
                            {stats?.reviews?.length ? (
                                <div className="space-y-4">
                                    {stats.reviews.map((review) => (
                                        <div key={review._id} className="border-b pb-4">
                                            {review.package && (
                                                <>
                                                    {renderPackageInfo(review.package, review.createdAt)}
                                                    <div className="mt-2">
                                                        <div className="flex items-center mb-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating
                                                                        ? 'text-yellow-400 fill-current'
                                                                        : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-gray-600 text-sm">{review.review}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No reviews yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;