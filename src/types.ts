import { Database } from '@projectint/types'

export type Address = Omit<Database['public']['Tables']['addresses']['Row'], 'created_at' | 'updated_at'>;
export type AddressTranslations = Omit<Database['public']['Tables']['address_translations']['Row'], 'created_at' | 'updated_at'>;

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
