import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Calendar, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';

interface UserData {
    name: string;
    email: string;
    // Add more user fields as needed
}

const Dashboard = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUserData(JSON.parse(userStr));
        }
        setLoading(false);
    }, []);

    // Protect dashboard route
    if (!localStorage.getItem('token')) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dashboard Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900">Welcome, {userData?.name}</h1>
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

            {/* Dashboard Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* User Profile Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 rounded-full p-3">
                                <User className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Profile</h3>
                                <p className="text-sm text-gray-500">{userData?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Tours Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 rounded-full p-3">
                                <Calendar className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Upcoming Tours</h3>
                                <p className="text-sm text-gray-500">2 tours scheduled</p>
                            </div>
                        </div>
                    </div>

                    {/* Favorite Destinations Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-100 rounded-full p-3">
                                <MapPin className="w-8 h-8 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Favorites</h3>
                                <p className="text-sm text-gray-500">5 saved destinations</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-yellow-100 rounded-full p-3">
                                <CreditCard className="w-8 h-8 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Payment Methods</h3>
                                <p className="text-sm text-gray-500">2 cards saved</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <p className="text-gray-500">No recent activity to show</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center">
                            <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                            Book New Tour
                        </button>
                        <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center">
                            <MapPin className="w-5 h-5 mr-3 text-green-600" />
                            View Destinations
                        </button>
                        <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center">
                            <Settings className="w-5 h-5 mr-3 text-purple-600" />
                            Account Settings
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;