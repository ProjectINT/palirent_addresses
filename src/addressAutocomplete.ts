import { createAddressProvider, ProviderConfig, AddressProvider } from './providers';

export interface AddressAutocompleteConfig extends ProviderConfig {
  searchLength?: number;
}

export interface AddressAutocompleteFunctions {
  getSuggestions: (query: string) => Promise<Array<{ formattedAddress: string; place_id: string }>>;
  getPlaceDetails: (placeId: string) => Promise<import('./types').ReturnAddressObject>;
  getPlaceDetailsWithOriginLocale: (placeId: string) => Promise<import('./providers/base').PlaceDetailsWithOriginLocale>;
}

export function createAddressAutocomplete(config: AddressAutocompleteConfig): AddressAutocompleteFunctions {
  const provider = createAddressProvider(config);

  return {
    async getSuggestions(query: string) {
      return provider.getSuggestions(query);
    },

    async getPlaceDetails(placeId: string) {
      return provider.getPlaceDetails(placeId);
    },

    async getPlaceDetailsWithOriginLocale(placeId: string) {
      return provider.getPlaceDetailsWithOriginLocale(placeId);
    }
  };
}
