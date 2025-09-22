# @projectint/palirent_addresses

TypeScript library for address helper functions with Google Places API integration.

## Installation

```bash
npm install @projectint/palirent_addresses
```

## Usage

```typescript
import { 
  placesAutocomplete, 
  composeAddressFromDetails,
  placesTypes,
  getPlaceName,
  getAddressComponentByType,
  v4,
  // Types
  Address,
  AddressTranslations,
  ReturnAddressObject,
  PlacePrediction,
  AddressComponent,
  Place,
  ComposeAddressParams
} from '@projectint/palirent_addresses';

// Example usage with Places Autocomplete API
const placesApi = placesAutocomplete({
  googleApiKey: 'your-api-key',
  searchLength: 5,
  languageCode: 'en'
});

// Get autocomplete suggestions
const suggestions = await placesApi.getSuggestions('New York');
// Returns: [{ formattedAddress: string, place_id: string }, ...]

// Get place details and compose address
const addressData = await placesApi.getPlaceDetails('place-id');
// Returns: ReturnAddressObject with address and translations

// Get place details with both origin (en) and localized versions
const detailsWithLocales = await placesApi.getPlaceDetailsWithOriginLocale('place-id');
// Returns: { origin: ReturnAddressObject, localized: ReturnAddressObject }

// Or compose address from raw place details
const addressData: ReturnAddressObject = composeAddressFromDetails({
  addressComponents: rawPlaceData.addressComponents,
  location: rawPlaceData.location,
  id: rawPlaceData.id,
  formattedAddress: rawPlaceData.formattedAddress,
  types: rawPlaceData.types,
  displayName: rawPlaceData.displayName,
});

// Result contains language-independent address data and translations
const { address, translations } = addressData;
```

## Types

This package exports comprehensive TypeScript types:

- `Address` - Language-independent address data (coordinates, number, zip code)
- `AddressTranslations` - Localized address components (country, state, city, street)
- `ReturnAddressObject` - Return type of composeAddressFromDetails function
- `ComposeAddressParams` - Parameters for composeAddressFromDetails function
- `PlacePrediction` - Place prediction from autocomplete
- `AddressComponent` - Address component structure
- `Place` - Google Places API place object

## API Reference

### Functions

- `placesAutocomplete(config)` - Returns object with methods for Google Places API:
  - `getSuggestions(query)` - Get autocomplete suggestions
  - `getPlaceDetails(placeId)` - Get place details as ReturnAddressObject
  - `getPlaceDetailsWithOriginLocale(placeId)` - Get place details in both English and specified locale
- `composeAddressFromDetails(params)` - Compose address object with language-independent data and translations from raw place details
- `placesTypes` - Object containing place type constants
- `getPlaceName(options)` - Extract place name from place types
- `getAddressComponentByType(components, type)` - Get address component by type
- `v4()` - Generate UUID v4

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

# Run tests with UI
npm run test:ui

# Development mode (watch TypeScript compilation)
npm run dev
```

## License

ISC