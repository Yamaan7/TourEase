export const geocodeLocation = async (address: string): Promise<[number, number]> => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();

        if (data.status === 'OK' && data.results && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            return [lng, lat];
        }

        console.warn(`Could not geocode address: ${address}`);
        return [0, 0];
    } catch (error) {
        console.error('Geocoding error:', error);
        return [0, 0];
    }
};