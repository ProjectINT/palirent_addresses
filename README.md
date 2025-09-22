# @projectint/palirent_addresses

TypeScript library for address helper functions with multiple provider support (Google Places API, 2GIS API).

## Installation

```bash
npm install @projectint/palirent_addresses
```

## Features

- **Multi-Provider Support**: Google Places API and 2GIS API
- **Unified Interface**: Same methods regardless of provider
- **Economic Options**: 2GIS offers cost-effective plans for CIS regions
- **TypeScript**: Full type safety and IntelliSense support
- **Localization**: Multi-language support
- **Backward Compatibility**: Existing Google Places code continues to work

## Quick Start

### Universal API (Recommended)

```typescript
import { createAddressAutocomplete } from '@projectint/palirent_addresses';

// Google Places API
const googleAutocomplete = createAddressAutocomplete({
  provider: 'google',
  apiKey: 'your-google-api-key',
  languageCode: 'ru',
  searchLength: 10,
});

// 2GIS API (economical for CIS regions)
const twogisAutocomplete = createAddressAutocomplete({
  provider: 'twogis',
  apiKey: 'your-twogis-api-key',
  languageCode: 'ru',
  searchLength: 10,
});

// Same interface for both providers
const suggestions = await googleAutocomplete.getSuggestions('Москва Красная');
const placeDetails = await googleAutocomplete.getPlaceDetails('place-id');
```

### Provider Comparison

| Feature | Google Places | 2GIS | Best Use Case |
|---------|---------------|------|---------------|
| **Global Coverage** | ✅ Worldwide | ❌ CIS regions only | Google for global, 2GIS for CIS |
| **Pricing** | $$$ Premium | $ Economic (150₽/30k requests) | 2GIS for budget projects |
| **Data Quality** | ✅ High | ✅ High (CIS regions) | Both excellent in their regions |
| **Languages** | 40+ languages | Russian, English + local | Depends on target audience |

## API Reference

### Universal Functions

```typescript
import { 
  createAddressAutocomplete,
  // Types
  ProviderType,
  ProviderConfig,
  AddressAutocompleteConfig,
  SuggestionOption,
  PlaceDetailsWithOriginLocale
} from '@projectint/palirent_addresses';

// Create autocomplete instance
const autocomplete = createAddressAutocomplete({
  provider: 'google' | 'twogis',
  apiKey: 'your-api-key',
  languageCode?: 'en' | 'ru' | 'uk' | ...,
  searchLength?: number
});

// Get suggestions
const suggestions = await autocomplete.getSuggestions('query');
// Returns: SuggestionOption[]

// Get place details
const details = await autocomplete.getPlaceDetails('place-id');
// Returns: ReturnAddressObject

// Get details in multiple locales
const localized = await autocomplete.getPlaceDetailsWithOriginLocale('place-id');
// Returns: { origin: ReturnAddressObject, localized: ReturnAddressObject }
```

### Legacy Google Places API (Backward Compatible)

```typescript
import { placesAutocomplete } from '@projectint/palirent_addresses';

const placesApi = placesAutocomplete({
  googleApiKey: 'your-api-key',
  searchLength: 5,
  languageCode: 'en'
});

const suggestions = await placesApi.getSuggestions('New York');
const details = await placesApi.getPlaceDetails('place-id');
```

### Address Composition

```typescript
import { composeAddressFromDetails, ReturnAddressObject } from '@projectint/palirent_addresses';

const addressData: ReturnAddressObject = composeAddressFromDetails({
  addressComponents: rawPlaceData.addressComponents,
  location: rawPlaceData.location,
  id: rawPlaceData.id,
  formattedAddress: rawPlaceData.formattedAddress,
  types: rawPlaceData.types,
  displayName: rawPlaceData.displayName,
});

// Language-independent data + localized translations
const { address, translations } = addressData;
```

### Helper Functions

```typescript
import { 
  placesTypes,
  getPlaceName,
  getAddressComponentByType,
  v4 
} from '@projectint/palirent_addresses';

// Utility functions
const placeName = getPlaceName({ placeTypes: ['restaurant'], displayName: 'Pizza Place' });
const country = getAddressComponentByType(components, 'country');
const sessionId = v4(); // Generate UUID
```

## TypeScript Types

```typescript
// Core types
interface ReturnAddressObject {
  address: Address;           // Coordinates, number, zip
  translations: AddressTranslations;  // Localized strings
}

interface Address {
  id: string;
  coordinates: number[] | null;
  number: string;
  zip_code: string;
  // ... other fields
}

interface AddressTranslations {
  locale: string;
  formatted_address: string;
  country: string;
  state: string;
  city: string;
  street: string;
  // ... other fields
}

// Provider types
type ProviderType = 'google' | 'twogis';
type LanguageCode = 'en' | 'ru' | 'uk' | 'ar' | ...;

interface ProviderConfig {
  provider: ProviderType;
  apiKey: string;
  languageCode?: LanguageCode;
  searchLength?: number;
}
```

## Migration Guide

### From Google-only to Multi-provider

**Before:**
```typescript
import { placesAutocomplete } from '@projectint/palirent_addresses';

const api = placesAutocomplete({
  googleApiKey: 'key',
  languageCode: 'ru'
});
```

**After (Google):**
```typescript
import { createAddressAutocomplete } from '@projectint/palirent_addresses';

const api = createAddressAutocomplete({
  provider: 'google',
  apiKey: 'key',
  languageCode: 'ru'
});
```

**After (2GIS):**
```typescript
import { createAddressAutocomplete } from '@projectint/palirent_addresses';

const api = createAddressAutocomplete({
  provider: 'twogis',
  apiKey: 'key',
  languageCode: 'ru'
});
```

## Examples

Detailed usage examples:

### Switching between providers
```typescript
const config = {
  apiKey: process.env.API_KEY!,
  languageCode: 'ru' as const,
  searchLength: 10
};

// Use Google for global coverage
const google = createAddressAutocomplete({
  provider: 'google',
  ...config
});

// Use 2GIS for CIS regions (more economical)
const twogis = createAddressAutocomplete({
  provider: 'twogis',
  ...config
});
```

### Error handling
```typescript
try {
  const suggestions = await autocomplete.getSuggestions('query');
  if (suggestions.length > 0) {
    const details = await autocomplete.getPlaceDetails(suggestions[0].place_id);
    console.log(details);
  }
} catch (error) {
  console.error('Address lookup failed:', error);
}
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Development mode
npm run dev
```

## License

ISC