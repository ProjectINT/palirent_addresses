"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeAddressFromDetails = void 0;
const helpers_1 = require("./helpers");
const composeAddressFromDetails = ({ addressComponents, location, id, formattedAddress, types, displayName, }) => {
    const country = (0, helpers_1.getAddressComponentByType)(addressComponents, 'country');
    const state = (0, helpers_1.getAddressComponentByType)(addressComponents, 'administrative_area_level_1') ||
        (0, helpers_1.getAddressComponentByType)(addressComponents, 'administrative_area_level_2');
    const city = (0, helpers_1.getAddressComponentByType)(addressComponents, 'locality');
    const street = (0, helpers_1.getAddressComponentByType)(addressComponents, 'route');
    const number = (0, helpers_1.getAddressComponentByType)(addressComponents, 'street_number');
    const zipCode = (0, helpers_1.getAddressComponentByType)(addressComponents, 'postal_code');
    let coordinates = null;
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
        formattedAddress: `${(0, helpers_1.getPlaceName)({ placeTypes: types, displayName: displayName.text })}${formattedAddress || ''}`,
        addressNote: '',
        coordinates,
    };
};
exports.composeAddressFromDetails = composeAddressFromDetails;
//# sourceMappingURL=composeAddressFromDetails.js.map