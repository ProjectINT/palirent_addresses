import { getPlaceName, getAddressComponentByTypeNew } from './helpers';
import { Address, AddressComponentNew } from './types';

interface ComposeAddressFromDetailsNewArg {
  addressComponents: AddressComponentNew[];
  location: { latitude: number; longitude: number };
  id: string; // placeId
  formattedAddress: string;
  types: string[];
  displayName: {
    text: string;
    languageCode: string;
  };
}

export const composeAddressFromDetailsNew = ({
  addressComponents, 
  location, 
  id, 
  formattedAddress, 
  types, 
  displayName,
}: ComposeAddressFromDetailsNewArg): Address => {
  const country = getAddressComponentByTypeNew(addressComponents, 'country');
  const state = getAddressComponentByTypeNew(addressComponents, 'administrative_area_level_1') || 
                getAddressComponentByTypeNew(addressComponents, 'administrative_area_level_2');
  const city = getAddressComponentByTypeNew(addressComponents, 'locality');
  const street = getAddressComponentByTypeNew(addressComponents, 'route');
  const number = getAddressComponentByTypeNew(addressComponents, 'street_number');
  const zipCode = getAddressComponentByTypeNew(addressComponents, 'postal_code');

  let coordinates: number[] | null = null;

  if (location?.latitude && location.longitude) {
    coordinates = [location.latitude, location.longitude];
  }

  return {
    id,
    country,
    state,
    city,
    street,
    number,
    zipCode,
    formattedAddress: `${getPlaceName({ placeTypes: types, displayName: displayName.text })}${formattedAddress || ''}`,
    addressNote: '',
    coordinates,
  };
};
