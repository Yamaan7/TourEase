import { useEffect, useState } from 'react';
import TourCard from './TourCard';
import { PayPalButtons } from "@paypal/react-paypal-js";

interface TourPackage {
    packageName: string;
    packageDescription: string;
    tourLocation: string;
    duration: number;
    maxGroupSize: number;
    price: number;
    image: string;
}

interface Tour {
    _id: string;
    agencyName: string;
    packages: TourPackage[];
    status: 'pending' | 'approved' | 'rejected';
}

const TourPackages = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApprovedTours();
    }, []);

    const fetchApprovedTours = async () => {
        try {
            console.log('Fetching approved tours...');
            const response = await fetch('http://localhost:5000/api/tours/approved');

            if (!response.ok) {
                throw new Error('Failed to fetch approved tours');
            }

            const data = await response.json();
            console.log('Fetched approved tours:', data);
            setTours(data);
        } catch (error) {
            console.error('Error fetching approved tours:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {tours.map((tour) => (
                tour.packages.map((pkg, index) => (
                    <div key={`${tour._id}-${index}`}>
                        <TourCard
                            tour={{
                                title: pkg.packageName,
                                description: pkg.packageDescription,
                                price: pkg.price,
                                duration: pkg.duration,
                                maxGroupSize: pkg.maxGroupSize,
                                difficulty: "medium",
                                images: [pkg.image],
                                startDates: [new Date()],
                                location: {
                                    address: pkg.tourLocation,
                                    coordinates: [0, 0]
                                },
                                rating: 5,
                                reviews: 5,
                                agencyName: tour.agencyName
                            }}
                        />
                    </div>
                ))
            ))}
        </div>
    );
};

export default TourPackages;