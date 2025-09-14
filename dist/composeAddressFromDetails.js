"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeAddressFromDetails = void 0;
const helpers_1 = require("./helpers");
const composeAddressFromDetails = ({ result, placeId }) => {
    const { address_components: addressComponents, geometry } = result;
    // https://developers.google.com/maps/documentation/geocoding/start#Types
    const country = (0, helpers_1.getAddressComponentByType)(addressComponents, 'country');
    const state = (0, helpers_1.getAddressComponentByType)(addressComponents, 'administrative_area_level_1') ||
        (0, helpers_1.getAddressComponentByType)(addressComponents, 'administrative_area_level_2');
    const city = (0, helpers_1.getAddressComponentByType)(addressComponents, 'locality');
    const street = (0, helpers_1.getAddressComponentByType)(addressComponents, 'route');
    const number = (0, helpers_1.getAddressComponentByType)(addressComponents, 'street_number');
    const zipCode = (0, helpers_1.getAddressComponentByType)(addressComponents, 'postal_code');
    let coordinates = null;
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
        formattedAddress: `${(0, helpers_1.getPlaceName)({ placeTypes: result.types, displayName: result.name })}${result.formatted_address || ''}`,
        addressNote: '',
        coordinates,
    };
};
exports.composeAddressFromDetails = composeAddressFromDetails;
//# sourceMappingURL=composeAddressFromDetails.js.map