# @projectint/palirent_addresses

TypeScript library for address helper functions with Google Places API integration.

## Installation

```bash
npm install @projectint/palirent_addresses
```

## Usage

```typescript
import { 
  getPlaceDetails, 
  placesAutocompleteNew, 
  composeAddressFromDetails,
  Address,
  PlacePrediction 
} from '@projectint/palirent_addresses';

// Example usage with Google Places API
const address: Address = await getPlaceDetails({
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  placesService: googlePlacesService,
  PlacesServiceStatus: google.maps.places.PlacesServiceStatus
});

// Example usage with Places Autocomplete New API
const placesApi = placesAutocompleteNew({
  googleApiKey: 'your-api-key',
  searchLength: 5,
  languageCode: 'en'
});

const suggestions = await placesApi.getSuggestions('New York');
const placeDetails = await placesApi.getPlaceDetails('place-id');
```

## Types

This package exports comprehensive TypeScript types:

- `Address` - Main address interface
- `PlacePrediction` - Place prediction from autocomplete
- `AddressComponent` - Address component structure
- `Place` - Google Places API place object
- And many more...

## API Reference

### Functions

- `getPlaceDetails()` - Get place details from Google Places API
- `composeAddressFromDetails()` - Compose address from place details
- `composeAddressFromDetailsNew()` - Compose address from new API format
- `placesAutocompleteNew()` - Places autocomplete with new API
- `getPlaceName()` - Extract place name from place types
- `getAddressComponentByType()` - Get address component by type
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