import { AddressProvider, BaseProviderConfig } from './base';
import { GooglePlacesProvider } from './google';
import { TwoGisProvider } from './twogis';

export type ProviderType = 'google' | 'twogis';

export interface ProviderConfig extends BaseProviderConfig {
  provider: ProviderType;
}

export function createAddressProvider(config: ProviderConfig): AddressProvider {
  switch (config.provider) {
    case 'google':
      return new GooglePlacesProvider(config);
    case 'twogis':
      return new TwoGisProvider(config);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// Экспортируем провайдеры для прямого использования если нужно
export { GooglePlacesProvider } from './google';
export { TwoGisProvider } from './twogis';
export type { AddressProvider, BaseProviderConfig, SuggestionOption, PlaceDetailsWithOriginLocale } from './base';
