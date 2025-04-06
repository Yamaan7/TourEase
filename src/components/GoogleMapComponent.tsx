import React, { useEffect, useRef } from 'react';

interface Location {
    coordinates: [number, number];
    name: string;
    description?: string;
}

interface GoogleMapProps {
    locations: Location[];
    center?: [number, number];
    zoom?: number;
    className?: string;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
    locations,
    center = [-74.5, 40],
    zoom = 9,
    className = "h-[400px] w-full rounded-lg overflow-hidden"
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);

    useEffect(() => {
        const loadGoogleMaps = () => {
            if (window.google) {
                initializeMap();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBJK0Os3KzWvS2ohjLNxjg1mKNC3VybPsc`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
        };

        const initializeMap = () => {
            if (!mapRef.current) return;

            // Create map instance with custom styling
            googleMapRef.current = new google.maps.Map(mapRef.current, {
                center: { lat: center[1], lng: center[0] },
                zoom: zoom,
                mapTypeId: 'roadmap',
                fullscreenControl: true,
                zoomControl: true,
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    },
                    {
                        featureType: "transit",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            });

            // Create bounds object
            const bounds = new google.maps.LatLngBounds();

            // Clear existing markers
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            // Add markers with custom styling
            locations.forEach((location) => {
                const marker = new google.maps.Marker({
                    position: { lat: location.coordinates[1], lng: location.coordinates[0] },
                    map: googleMapRef.current,
                    title: location.name,
                    animation: google.maps.Animation.DROP,
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: new google.maps.Size(40, 40)
                    }
                });

                if (location.description) {
                    const infoWindow = new google.maps.InfoWindow({
                        content: `
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 8px; color: #1a73e8;">
                  ${location.name}
                </h3>
                <p style="color: #5f6368; font-size: 14px;">
                  ${location.description}
                </p>
              </div>
            `,
                        maxWidth: 250
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(googleMapRef.current, marker);
                    });
                }

                markersRef.current.push(marker);
                bounds.extend(marker.getPosition()!);
            });

            // Fit map to bounds if there are multiple locations
            if (locations.length > 1) {
                googleMapRef.current.fitBounds(bounds);
                googleMapRef.current.setZoom(googleMapRef.current.getZoom()! - 1);
            }
        };

        loadGoogleMaps();

        return () => {
            // Cleanup markers on unmount
            markersRef.current.forEach(marker => marker.setMap(null));
        };
    }, [locations, center, zoom]);

    return <div ref={mapRef} className={className} />;
};

export default GoogleMapComponent;