export interface TourPackage {
    _id: string;
    packageName: string;
    packageDescription: string;
    tourLocation: string;
    duration: number;
    maxGroupSize: number;
    price: number;
    image: string;
    coordinates?: [number, number];
    rating?: number;
    reviewCount?: number;
}

export interface Tour {
    _id: string;
    agencyName: string;
    packages: TourPackage[];
    status: 'pending' | 'approved' | 'rejected';
}