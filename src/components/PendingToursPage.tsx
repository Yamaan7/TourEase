import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Package {
    packageName: string;
    tourLocation: string;
    duration: number;
    price: number;
    packageDescription: string;
    image?: string;
}

interface Tour {
    _id: string;
    agencyName: string;
    status: 'pending' | 'approved' | 'rejected';
    packages: Package[];
}

const PendingToursPage: React.FC = () => {
    const [pendingTours, setPendingTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPendingTours = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await axios.get<Tour[]>('/api/tours/pending', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPendingTours(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching pending tours:', err);
            setError('Failed to load pending tours');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (tourId: string, newStatus: Tour['status']): Promise<void> => {
        try {
            await axios.patch(
                `/api/tours/${tourId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            // Refresh the tours list after update
            fetchPendingTours();
        } catch (err) {
            console.error('Error updating tour status:', err);
            setError('Failed to update tour status');
        }
    };

    useEffect(() => {
        fetchPendingTours();
    }, []);

    if (loading) return <div>Loading pending tours...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Pending Tour Packages</h2>

            {pendingTours.length === 0 ? (
                <p>No pending tour packages to review.</p>
            ) : (
                <div className="space-y-6">
                    {pendingTours.map((tour) => (
                        <div key={tour._id} className="border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">
                                    Agency: {tour.agencyName}
                                </h3>
                                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    {tour.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {tour.packages.map((pkg, index) => (
                                    <div key={index} className="border-t pt-4">
                                        <h4 className="font-medium">{pkg.packageName}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {pkg.tourLocation} • {pkg.duration} Days • ${pkg.price}
                                        </p>
                                        <p className="mt-2 text-sm">{pkg.packageDescription.substring(0, 150)}...</p>
                                        {pkg.image && (
                                            <img
                                                src={pkg.image}
                                                alt={pkg.packageName}
                                                className="mt-2 h-32 w-auto object-cover rounded"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    onClick={() => handleStatusUpdate(tour._id, 'rejected')}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(tour._id, 'approved')}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingToursPage;