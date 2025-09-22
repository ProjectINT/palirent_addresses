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
  longText: string;
  shortText: string;
}

export interface Place {
  addressComponents: AddressComponent[];
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  displayName: {
    text: string;
    languageCode: string;
  };
  types: string[];
  id: string;
}

export interface ComposeAddressParams {
  addressComponents: AddressComponent[];
  location: { latitude: number; longitude: number };
  id: string; // placeId
  formattedAddress: string;
  types: string[];
  displayName: {
    text: string;
    languageCode: string;
  };
}
