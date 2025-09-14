import { placesTypes } from './placesTypes';
import { getPlaceName, getAddressComponentByType } from './helpers';
import { Address, ComposeAddressParams } from './types';

export const composeAddressFromDetails = ({ result, placeId }: ComposeAddressParams): Address => {
  const { address_components: addressComponents, geometry } = result;

  // https://developers.google.com/maps/documentation/geocoding/start#Types
  const country = getAddressComponentByType(addressComponents, 'country');
  const state = getAddressComponentByType(addressComponents, 'administrative_area_level_1') || 
                getAddressComponentByType(addressComponents, 'administrative_area_level_2');
  const city = getAddressComponentByType(addressComponents, 'locality');
  const street = getAddressComponentByType(addressComponents, 'route');
  const number = getAddressComponentByType(addressComponents, 'street_number');
  const zipCode = getAddressComponentByType(addressComponents, 'postal_code');

  let coordinates: number[] | null = null;

  if (geometry?.location && typeof geometry.location.lat === 'function' && typeof geometry.location.lng === 'function') {
    coordinates = [geometry.location.lat(), geometry.location.lng()];
  }

  return {
    id: placeId,
    country,
    state,
    city,
    street,
    number,
    zipCode,
    formattedAddress: `${getPlaceName({ placeTypes: result.types, displayName: result.name })}${result.formatted_address || ''}`,
    addressNote: '',
    coordinates,
  };
};
