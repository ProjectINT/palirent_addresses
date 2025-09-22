export { composeAddressFromDetails } from './composeAddressFromDetails';
export { placesTypes } from './placesTypes';
export { getPlaceName, getAddressComponentByType, v4 } from './helpers';

export { placesAutocomplete } from './placesAutocomplete'; // это нужно экспортировать, остальные функции - внутренние.

// Новый универсальный API для работы с разными провайдерами
export { createAddressAutocomplete } from './addressAutocomplete';
export { createAddressProvider } from './providers';
export type { ProviderType, ProviderConfig } from './providers';

// Re-export types
export type {
  Address,
  AddressTranslations,
  ReturnAddressObject,
  PlacePrediction,
  AddressComponent,
  Place,
  ComposeAddressParams,
} from './types';

export type {
  AddressProvider,
  BaseProviderConfig,
  SuggestionOption,
  PlaceDetailsWithOriginLocale,
  LanguageCode
} from './providers/base';

export type { AddressAutocompleteConfig, AddressAutocompleteFunctions } from './addressAutocomplete';
