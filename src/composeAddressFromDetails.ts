import { getPlaceName, getAddressComponentByType } from './helpers';
import { Address, AddressComponent, ComposeAddressParams } from './types';

export const composeAddressFromDetails = ({
  addressComponents, 
  location, 
  id, 
  formattedAddress, 
  types, 
  displayName,
}: ComposeAddressParams): Address => {
  const country = getAddressComponentByType(addressComponents, 'country');
  const state = getAddressComponentByType(addressComponents, 'administrative_area_level_1') || 
                getAddressComponentByType(addressComponents, 'administrative_area_level_2');
  const city = getAddressComponentByType(addressComponents, 'locality');
  const street = getAddressComponentByType(addressComponents, 'route');
  const number = getAddressComponentByType(addressComponents, 'street_number');
  const zipCode = getAddressComponentByType(addressComponents, 'postal_code');

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
