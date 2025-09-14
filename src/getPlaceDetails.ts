import { getAddressComponentByType } from './helpers';
import { composeAddressFromDetails } from './composeAddressFromDetails';
import { Address, GetPlaceDetailsParams, Place } from './types';

export const getPlaceDetails = ({ placeId, placesService, PlacesServiceStatus }: GetPlaceDetailsParams): Promise<Address> => 
  new Promise((resolve, reject) => {
    if (!placesService) {
      return reject(new Error('PlacesService is not initialized'));
    }

    const request = {
      placeId,
      fields: ['address_components', 'formatted_address', 'name', 'types', 'geometry'],
    };

    placesService.getDetails(request, (result: Place | null, status: any) => {
      if (status !== PlacesServiceStatus.OK) {
        reject(new Error(`Places service error: ${status}`));
        return;
      }

      if (!result) {
        reject(new Error('No place details found'));
        return;
      }

      const address = composeAddressFromDetails({ result, placeId });

      resolve(address);
    });
  });
