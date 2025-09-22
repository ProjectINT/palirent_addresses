import { composeAddressFromDetails } from './composeAddressFromDetails';
import { v4 } from './helpers';
import { PlacePrediction, Address } from './types';

const SUGGESTIONS_ENDPOINT = 'https://places.googleapis.com/v1/places:autocomplete';
const DETAILS_ENDPOINT = 'https://places.googleapis.com/v1/places';

interface SuggestionOption {
  formattedAddress: string;
  place_id: string;
}

interface PlaceDetailsWithOriginLocale {
  origin: Address;
  localized: Address;
}

type LanguageCode = 
  | 'en' | 'af' | 'sq' | 'am' | 'ar' | 'hy' | 'az' | 'eu' | 'be' | 'bn' | 'bs' | 'bg' | 'my' | 'ca' | 'zh' 
  | 'zh-CN' | 'zh-HK' | 'zh-TW' | 'hr' | 'cs' | 'da' | 'nl' | 'en-AU' | 'en-GB' | 'et' | 'fa' | 'fi' 
  | 'fil' | 'fr' | 'fr-CA' | 'gl' | 'ka' | 'de' | 'el' | 'gu' | 'iw' | 'hi' | 'hu' | 'is' | 'id' | 'it';

interface PlacesAutocompleteProps {
  googleApiKey: string;
  searchLength: number;
  languageCode?: LanguageCode;
}

interface PlacesFunctions {
  getSuggestions: (actualQuery: string) => Promise<SuggestionOption[]>;
  getPlaceDetails: (placeId: string) => Promise<Address>;
  getPlaceDetailsWithOriginLocale: (placeId: string) => Promise<PlaceDetailsWithOriginLocale>;
}

interface FetchPlaceDetailsParams {
  placeId: string;
  sessionToken: string;
  languageCode: LanguageCode;
  googleApiKey: string;
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

async function fetchPlaceDetails({ placeId, sessionToken, languageCode, googleApiKey }: FetchPlaceDetailsParams): Promise<Response> {
  return fetch(`${DETAILS_ENDPOINT}/${placeId}?sessionToken=${sessionToken}&languageCode=${languageCode}`, {
    method: 'GET',
    headers: {
      'X-Goog-FieldMask': 'id,addressComponents,location,types,formattedAddress,displayName',
      'X-Goog-Api-Key': googleApiKey,
    },
  });
}

export function placesAutocomplete({ googleApiKey, searchLength, languageCode = 'en' }: PlacesAutocompleteProps): PlacesFunctions {
  const formatSuggestions = (response: Array<{ placePrediction: PlacePrediction }>): SuggestionOption[] => {
    const formatPrediction = (prediction: PlacePrediction): SuggestionOption => ({
      formattedAddress: prediction.text.text,
      place_id: prediction.placeId,
    });
    const formatted = response.map(({ placePrediction }) => formatPrediction(placePrediction));
  
    return formatted;
  };

  let sessionToken = v4();

  return {
    async getSuggestions(actualQuery: string): Promise<SuggestionOption[]> {
      const suggestions = await fetch(SUGGESTIONS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googleApiKey,
        },
        body: JSON.stringify({
          languageCode: languageCode,
          input: actualQuery,
          sessionToken,
        }),
      });
    
      const response = await suggestions.json() as SuggestionsResponse;
    
      const resultSuggestions = formatSuggestions(response.suggestions || []);
    
      return resultSuggestions;
    },

    async getPlaceDetails(placeId: string): Promise<Address> {
      const response = await fetchPlaceDetails({
        placeId,
        sessionToken,
        languageCode,
        googleApiKey
      });

      const data = await response.json() as PlaceDetailsResponse;
      
      sessionToken = v4();

      return composeAddressFromDetails(data);
    },

    async getPlaceDetailsWithOriginLocale(placeId: string): Promise<PlaceDetailsWithOriginLocale> {
      const responseOrigin = fetchPlaceDetails({
        placeId,
        sessionToken,
        languageCode: "en",
        googleApiKey
      });

      const responseLocalized = fetchPlaceDetails({
        placeId,
        sessionToken,
        languageCode,
        googleApiKey
      });

      const responses = await Promise.all([
        responseOrigin,
        responseLocalized,
      ]);

      const data = await Promise.all([
        responses[0].json() as Promise<PlaceDetailsResponse>,
        responses[1].json() as Promise<PlaceDetailsResponse>
      ]);
      
      sessionToken = v4();

      return {
        origin: composeAddressFromDetails(data[0]),
        localized: composeAddressFromDetails(data[1]),
      };
    }
  };
}
