import { getPlaceName, getAddressComponentByType } from './helpers';
import { Address, AddressTranslations, ComposeAddressParams, ReturnAddressObject } from './types';

export const composeAddressFromDetails = ({
  addressComponents, 
  location, 
  id, 
  formattedAddress, 
  types, 
  displayName,
}: ComposeAddressParams): ReturnAddressObject => {
  const country =  getAddressComponentByType(addressComponents, 'country');
  const state   =  getAddressComponentByType(addressComponents, 'administrative_area_level_1') || 
    getAddressComponentByType(addressComponents, 'administrative_area_level_2');
  const city    =  getAddressComponentByType(addressComponents, 'locality');
  const street  =  getAddressComponentByType(addressComponents, 'route');
  const number  =  getAddressComponentByType(addressComponents, 'street_number');
  const zipCode =  getAddressComponentByType(addressComponents, 'postal_code');

  let coordinates: number[] | null = null;

  if (location?.latitude && location.longitude) {
    coordinates = [location.latitude, location.longitude];
  }

  return {
    address: {
      id,
      address_note: null,
      coordinates: coordinates,
      number: number,
      zip_code: zipCode,
    },
    translations: {
      address_id: id,
      locale: displayName.languageCode as any,
      formatted_address: formattedAddress || `${getPlaceName({ placeTypes: types, displayName: displayName.text })}`,
      country: country || '',
      state: state,
      city: city || '',
      street: street,
    }
  };
};
