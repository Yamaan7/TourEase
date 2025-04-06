import { useEffect, useState } from 'react';
import TourCard from './TourCard';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { geocodeLocation } from '../utils/geocoding';
import { useMapLocations } from '../hooks/useMapLocations';
import TourMap from './TourMap';

interface TourPackage {
    _id: string;
    packageName: string;
    packageDescription: string;
    tourLocation: string;
    duration: number;
    maxGroupSize: number;
    price: number;
    image: string;
    rating?: number;
    reviewCount?: number;
    isLiked?: boolean;  // Add this
    likesCount?: number;  // Add this
    coordinates?: [number, number]; // Add this field
}

interface Tour {
    _id: string;
    agencyName: string;
    packages: TourPackage[];
    status: 'pending' | 'approved' | 'rejected';
}

// Add these interfaces at the top with your other interfaces
interface PackageStats {
    averageRating: number;
    reviewCount: number;
}

interface PackageStatMap {
    [key: string]: PackageStats;
}

const TourPackages = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [packageStats, setPackageStats] = useState<PackageStatMap>({});
    const mapLocations = useMapLocations(tours);

    useEffect(() => {
        fetchApprovedTours();
    }, []);

    // Add this function to fetch stats for a single package
    const fetchPackageStats = async (tourId: string, packageId: string) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/reviews/package-stats/${tourId}/${packageId}`
            );
            if (!response.ok) throw new Error('Failed to fetch package stats');
            return await response.json();
        } catch (error) {
            console.error('Error fetching package stats:', error);
            return { averageRating: 0, reviewCount: 0 };
        }
    };

    // const fetchApprovedTours = async () => {
    //     try {
    //         console.log('Fetching approved tours...');
    //         const response = await fetch('http://localhost:5000/api/tours/approved');

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch approved tours');
    //         }

    //         const data = await response.json();

    //         // Geocode all locations
    //         const toursWithCoordinates = await Promise.all(
    //             data.map(async (tour: Tour) => ({
    //                 ...tour,
    //                 packages: await Promise.all(
    //                     tour.packages.map(async (pkg) => ({
    //                         ...pkg,
    //                         coordinates: await geocodeLocation(pkg.tourLocation)
    //                     }))
    //                 )
    //             }))
    //         );

    //         console.log('Tours with coordinates:', toursWithCoordinates);
    //         setTours(toursWithCoordinates);
    //     } catch (error) {
    //         console.error('Error fetching approved tours:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Modify fetchApprovedTours to also fetch initial stats
    const fetchApprovedTours = async () => {
        try {
            console.log('Fetching approved tours...');
            const response = await fetch('http://localhost:5000/api/tours/approved');

            if (!response.ok) {
                throw new Error('Failed to fetch approved tours');
            }

            const data = await response.json();

            // Geocode all locations and fetch initial stats
            const toursWithCoordinates = await Promise.all(
                data.map(async (tour: Tour) => ({
                    ...tour,
                    packages: await Promise.all(
                        tour.packages.map(async (pkg) => {
                            // Fetch coordinates and stats in parallel
                            const [coordinates, stats] = await Promise.all([
                                geocodeLocation(pkg.tourLocation),
                                fetchPackageStats(tour._id, pkg._id)
                            ]);

                            // Update package stats state
                            setPackageStats(prev => ({
                                ...prev,
                                [`${tour._id}-${pkg._id}`]: stats
                            }));

                            return {
                                ...pkg,
                                coordinates
                            };
                        })
                    )
                }))
            );

            console.log('Tours with coordinates and stats:', toursWithCoordinates);
            setTours(toursWithCoordinates);
        } catch (error) {
            console.error('Error fetching approved tours:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // Update handleReviewSubmitted to handle individual package stats
    const handleReviewSubmitted = async (tourId: string, packageId: string) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/reviews/package-stats/${tourId}/${packageId}`
            );
            if (!response.ok) throw new Error('Failed to fetch updated stats');

            const stats = await response.json();

            // Update stats for this specific package
            setPackageStats(prev => ({
                ...prev,
                [`${tourId}-${packageId}`]: {
                    averageRating: stats.averageRating,
                    reviewCount: stats.reviewCount
                }
            }));
        } catch (error) {
            console.error('Error refreshing package stats:', error);
        }
    };

    // Calculate average rating should prioritize package stats
    const calculateAverageRating = (tourId: string, packageId: string, pkg: TourPackage) => {
        const stats = packageStats[`${tourId}-${packageId}`];
        if (stats && typeof stats.averageRating === 'number') {
            return stats.averageRating;
        }
        // Fallback to package data if stats not yet loaded
        if (!pkg.rating || !pkg.reviewCount || pkg.reviewCount === 0) {
            return 0;
        }
        return pkg.rating / pkg.reviewCount;
    };

    return (
        <>
            {/* Add map view above or below the grid */}
            <div className="mb-6">
                <TourMap
                    locations={mapLocations}
                    className="h-[400px] w-full rounded-lg shadow-lg"
                    zoom={2} // Start zoomed out to show all locations
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {tours.map((tour) => (
                    tour.packages.map((pkg, index) => (
                        <div key={`${tour._id}-${index}`}>
                            <TourCard
                                tour={{
                                    _id: tour._id,
                                    packageId: pkg._id,
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
                                        coordinates: pkg.coordinates || [0, 0]
                                    },
                                    rating: calculateAverageRating(tour._id, pkg._id, pkg),
                                    reviews: packageStats[`${tour._id}-${pkg._id}`]?.reviewCount || pkg.reviewCount || 0,
                                    agencyName: tour.agencyName
                                }}
                                onReviewSubmitted={() => handleReviewSubmitted(tour._id, pkg._id)}
                            />
                        </div>
                    ))
                ))}
            </div>
        </>
    );
};

export default TourPackages;