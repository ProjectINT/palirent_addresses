import { AddressProvider, SuggestionOption, PlaceDetailsWithOriginLocale, BaseProviderConfig, LanguageCode } from './base';
import { ReturnAddressObject } from '../types';
import { composeAddressFromDetails } from '../composeAddressFromDetails';
import { v4 } from '../helpers';

const SUGGESTIONS_ENDPOINT = 'https://places.googleapis.com/v1/places:autocomplete';
const DETAILS_ENDPOINT = 'https://places.googleapis.com/v1/places';

interface PlacePrediction {
  text: {
    text: string;
  };
  placeId: string;
}

interface SuggestionsResponse {
  suggestions?: Array<{ placePrediction: PlacePrediction }>;
}

interface PlaceDetailsResponse {
  id: string;
  addressComponents: Array<{
    types: string[];
    longText: string;
    shortText: string;
  }>;
  location: { latitude: number; longitude: number };
  types: string[];
  formattedAddress: string;
  displayName: {
    text: string;
    languageCode: string;
  };
}

interface FetchPlaceDetailsParams {
  placeId: string;
  sessionToken: string;
  languageCode: LanguageCode;
  googleApiKey: string;
}

async function fetchPlaceDetails({ placeId, sessionToken, languageCode, googleApiKey }: FetchPlaceDetailsParams): Promise<Response> {
  return fetch(`${DETAILS_ENDPOINT}/${placeId}?sessionToken=${sessionToken}&languageCode=${languageCode}`, {
    method: 'GET',
    headers: {
      'X-Goog-FieldMask': 'id,addressComponents,location,types,formattedAddress,displayName',
      'X-Goog-Api-Key': googleApiKey,
    },
  });
}

export class GooglePlacesProvider implements AddressProvider {
  private sessionToken: string;
  
  constructor(
    private config: BaseProviderConfig
  ) {
    this.sessionToken = v4();
  }

  async getSuggestions(query: string): Promise<SuggestionOption[]> {
    const suggestions = await fetch(SUGGESTIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.config.apiKey,
      },
      body: JSON.stringify({
        languageCode: this.config.languageCode || 'en',
        input: query,
        sessionToken: this.sessionToken,
      }),
    });

    const response = await suggestions.json() as SuggestionsResponse;
    
    return this.formatSuggestions(response.suggestions || []);
  }

  async getPlaceDetails(placeId: string): Promise<ReturnAddressObject> {
    const response = await fetchPlaceDetails({
      placeId,
      sessionToken: this.sessionToken,
      languageCode: this.config.languageCode || 'en',
      googleApiKey: this.config.apiKey
    });

    const data = await response.json() as PlaceDetailsResponse;
    
    this.sessionToken = v4();

    return composeAddressFromDetails(data);
  }

  async getPlaceDetailsWithOriginLocale(placeId: string): Promise<PlaceDetailsWithOriginLocale> {
    const responseOrigin = fetchPlaceDetails({
      placeId,
      sessionToken: this.sessionToken,
      languageCode: "en",
      googleApiKey: this.config.apiKey
    });

    const responseLocalized = fetchPlaceDetails({
      placeId,
      sessionToken: this.sessionToken,
      languageCode: this.config.languageCode || 'en',
      googleApiKey: this.config.apiKey
    });

    const responses = await Promise.all([
      responseOrigin,
      responseLocalized,
    ]);

    const data = await Promise.all([
      responses[0].json() as Promise<PlaceDetailsResponse>,
      responses[1].json() as Promise<PlaceDetailsResponse>
    ]);
    
    this.sessionToken = v4();

    return {
      origin: composeAddressFromDetails(data[0]),
      localized: composeAddressFromDetails(data[1]),
    };
  }

  private formatSuggestions(response: Array<{ placePrediction: PlacePrediction }>): SuggestionOption[] {
    return response.map(({ placePrediction }) => ({
      formattedAddress: placePrediction.text.text,
      place_id: placePrediction.placeId,
    }));
  }
}
