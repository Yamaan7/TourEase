declare global {
    interface Window {
        google: {
            maps: {
                Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
                Marker: new (options: google.maps.MarkerOptions) => google.maps.Marker;
                InfoWindow: new (options: google.maps.InfoWindowOptions) => google.maps.InfoWindow;
                LatLngBounds: new () => google.maps.LatLngBounds;
                LatLng: new (lat: number, lng: number) => google.maps.LatLng;
                places: {
                    Autocomplete: new (
                        inputField: HTMLInputElement,
                        options?: google.maps.places.AutocompleteOptions
                    ) => google.maps.places.Autocomplete;
                };
            };
        };
    }
}

declare namespace google.maps {
    namespace places {
        interface Autocomplete {
            bindTo(key: string, target: any): void;
            addListener(event: string, handler: () => void): void;
            getPlace(): PlaceResult;
        }

        interface PlaceResult {
            geometry?: {
                location: LatLng;
                viewport?: LatLngBounds;
            };
            name?: string;
        }

        interface AutocompleteOptions {
            types?: string[];
            componentRestrictions?: { country: string | string[] };
        }
    }
}