import { useState, useEffect } from 'react';
import type { Tour, TourPackage } from '../types';

interface MapLocation {
    coordinates: [number, number];
    name: string;
    description: string;
}

export const useMapLocations = (tours: Tour[]) => {
    const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);

    useEffect(() => {
        const locations = tours.flatMap(tour =>
            tour.packages.map((pkg: TourPackage) => ({
                coordinates: pkg.coordinates || [0, 0],
                name: pkg.packageName,
                description: `${pkg.packageDescription}\nLocation: ${pkg.tourLocation}\nBy: ${tour.agencyName}`
            }))
        );

        setMapLocations(locations);
    }, [tours]);

    return mapLocations;
};