import { ReturnAddressObject } from '../types';

export interface SuggestionOption {
  formattedAddress: string;
  place_id: string;
}

export interface PlaceDetailsWithOriginLocale {
  origin: ReturnAddressObject;
  localized: ReturnAddressObject;
}

export interface AddressProvider {
  getSuggestions(query: string): Promise<SuggestionOption[]>;
  getPlaceDetails(placeId: string): Promise<ReturnAddressObject>;
  getPlaceDetailsWithOriginLocale(placeId: string): Promise<PlaceDetailsWithOriginLocale>;
}

export type LanguageCode = 
  | 'en' | 'af' | 'sq' | 'am' | 'ar' | 'hy' | 'az' | 'eu' | 'be' | 'bn' | 'bs' | 'bg' | 'my' | 'ca' | 'zh' 
  | 'zh-CN' | 'zh-HK' | 'zh-TW' | 'hr' | 'cs' | 'da' | 'nl' | 'en-AU' | 'en-GB' | 'et' | 'fa' | 'fi' 
  | 'fil' | 'fr' | 'fr-CA' | 'gl' | 'ka' | 'de' | 'el' | 'gu' | 'iw' | 'hi' | 'hu' | 'is' | 'id' | 'it'
  | 'ru' | 'uk';

export interface BaseProviderConfig {
  apiKey: string;
  languageCode?: LanguageCode;
  searchLength?: number;
}
