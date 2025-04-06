import React, { useEffect, useRef } from 'react';

interface Location {
  coordinates: [number, number];
  name: string;
  description?: string;
}

interface TourMapProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const TourMap: React.FC<TourMapProps> = ({
  locations,
  center = [-74.5, 40],
  zoom = 9,
  className = "h-[400px] w-full rounded-lg overflow-hidden"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Load Google Maps Script

    // const loadGoogleMaps = () => {
    //   if (window.google) {
    //     initializeMap();
    //     return;
    //   }

    //   const script = document.createElement('script');
    //   script.src = `https://maps.gomaps.pro/maps/api/js?key=${import.meta.env.VITE_GOMAPS_API_KEY}`;
    //   script.async = true;
    //   script.defer = true;
    //   script.onload = initializeMap;
    //   document.head.appendChild(script);

    //   script.onload = initializeMap;
    // };

    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      // Update this line to use Google Maps API instead of GoMaps
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Create map instance
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: center[1], lng: center[0] },
        zoom: zoom,
        mapTypeId: 'roadmap',
        fullscreenControl: true,
        zoomControl: true,
      });

      // Create bounds object
      const bounds = new google.maps.LatLngBounds();

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers
      locations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.coordinates[1], lng: location.coordinates[0] },
          map: googleMapRef.current,
          title: location.name
        });

        if (location.description) {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3 style="font-weight: bold; margin-bottom: 4px;">${location.name}</h3>
                <p>${location.description}</p>
              </div>
            `
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

export default TourMap;