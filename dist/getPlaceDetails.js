"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaceDetails = void 0;
const composeAddressFromDetails_1 = require("./composeAddressFromDetails");
const getPlaceDetails = ({ placeId, placesService, PlacesServiceStatus }) => new Promise((resolve, reject) => {
    if (!placesService) {
        return reject(new Error('PlacesService is not initialized'));
    }
    const request = {
        placeId,
        fields: ['address_components', 'formatted_address', 'name', 'types', 'geometry'],
    };
    placesService.getDetails(request, (result, status) => {
        if (status !== PlacesServiceStatus.OK) {
            reject(new Error(`Places service error: ${status}`));
            return;
        }
        if (!result) {
            reject(new Error('No place details found'));
            return;
        }
        const address = (0, composeAddressFromDetails_1.composeAddressFromDetails)({ result, placeId });
        resolve(address);
    });
});
exports.getPlaceDetails = getPlaceDetails;
//# sourceMappingURL=getPlaceDetails.js.map