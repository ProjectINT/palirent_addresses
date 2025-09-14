"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeAddressFromDetailsNew = void 0;
const helpers_1 = require("./helpers");
const composeAddressFromDetailsNew = ({ addressComponents, location, id, formattedAddress, types, displayName, }) => {
    const country = (0, helpers_1.getAddressComponentByTypeNew)(addressComponents, 'country');
    const state = (0, helpers_1.getAddressComponentByTypeNew)(addressComponents, 'administrative_area_level_1') ||
        (0, helpers_1.getAddressComponentByTypeNew)(addressComponents, 'administrative_area_level_2');
    const city = (0, helpers_1.getAddressComponentByTypeNew)(addressComponents, 'locality');
    const street = (0, helpers_1.getAddressComponentByTypeNew)(addressComponents, 'route');
    const number = (0, helpers_1.getAddressComponentByTypeNew)(addressComponents, 'street_number');
    const zipCode = (0, helpers_1.getAddressComponentByTypeNew)(addressComponents, 'postal_code');
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
exports.composeAddressFromDetailsNew = composeAddressFromDetailsNew;
//# sourceMappingURL=composeAddressFromDetailsNew.js.map