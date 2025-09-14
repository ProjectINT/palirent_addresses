export interface Address {
  id: string;
  city: string;
  country: string;
  formattedAddress: string;
  addressNote?: string | null;
  number?: string | null;
  state?: string | null;
  street?: string | null;
  zipCode?: string | null;
  coordinates?: number[] | null;
}

export interface PlacePrediction {
  text: {
    text: string;
  };
  placeId: string;
}

export interface AddressComponent {
  types: string[];
  long_name: string;
  short_name: string;
}

export interface AddressComponentNew {
  types: string[];
  longText: string;
  shortText: string;
}

export interface GoogleMapsLocation {
  lat(): number;
  lng(): number;
}

export interface GoogleMapsViewport {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

export interface Place {
  address_components: AddressComponent[];
  formatted_address?: string;
  geometry?: {
    location: GoogleMapsLocation;
    viewport: GoogleMapsViewport;
  };
  name: string;
  types: string[];
}

export type PlaceDetailsStatus = 
  | 'OK' 
  | 'ZERO_RESULTS' 
  | 'NOT_FOUND' 
  | 'INVALID_REQUEST' 
  | 'OVER_QUERY_LIMIT' 
  | 'REQUEST_DENIED' 
  | 'UNKNOWN_ERROR';

export interface PlaceDetails {
  html_attributions: string[];
  result: Place;
  status: PlaceDetailsStatus;
}

// Google Maps API types (simplified)
export interface GoogleMapsPlacesService {
  getDetails(request: any, callback: (result: Place | null, status: any) => void): void;
}

export interface GoogleMapsPlacesServiceStatus {
  OK: string;
  ZERO_RESULTS: string;
  NOT_FOUND: string;
  INVALID_REQUEST: string;
  OVER_QUERY_LIMIT: string;
  REQUEST_DENIED: string;
  UNKNOWN_ERROR: string;
}

export interface GetPlaceDetailsParams {
  placeId: string;
  placesService: GoogleMapsPlacesService;
  PlacesServiceStatus: GoogleMapsPlacesServiceStatus;
}

export interface ComposeAddressParams {
  result: Place;
  placeId: string;
}
