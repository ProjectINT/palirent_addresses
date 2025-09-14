"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placesAutocompleteNew = placesAutocompleteNew;
const composeAddressFromDetailsNew_1 = require("./composeAddressFromDetailsNew");
const helpers_1 = require("./helpers");
const SUGGESTIONS_ENDPOINT = 'https://places.googleapis.com/v1/places:autocomplete';
const DETAILS_ENDPOINT = 'https://places.googleapis.com/v1/places';
async function fetchPlaceDetails({ placeId, sessionToken, languageCode, googleApiKey }) {
    return fetch(`${DETAILS_ENDPOINT}/${placeId}?sessionToken=${sessionToken}&languageCode=${languageCode}`, {
        method: 'GET',
        headers: {
            'X-Goog-FieldMask': 'id,addressComponents,location,types,formattedAddress,displayName',
            'X-Goog-Api-Key': googleApiKey,
        },
    });
}
function placesAutocompleteNew({ googleApiKey, searchLength, languageCode = 'en' }) {
    const formatSuggestions = (response) => {
        const formatPrediction = (prediction) => ({
            formattedAddress: prediction.text.text,
            place_id: prediction.placeId,
        });
        const formatted = response.map(({ placePrediction }) => formatPrediction(placePrediction));
        return formatted;
    };
    let sessionToken = (0, helpers_1.v4)();
    return {
        async getSuggestions(actualQuery) {
            const suggestions = await fetch(SUGGESTIONS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': googleApiKey,
                },
                body: JSON.stringify({
                    languageCode: languageCode,
                    input: actualQuery,
                    sessionToken,
                }),
            });
            const response = await suggestions.json();
            const resultSuggestions = formatSuggestions(response.suggestions || []);
            return resultSuggestions;
        },
        async getPlaceDetails(placeId) {
            const response = await fetchPlaceDetails({
                placeId,
                sessionToken,
                languageCode,
                googleApiKey
            });
            const data = await response.json();
            sessionToken = (0, helpers_1.v4)();
            return (0, composeAddressFromDetailsNew_1.composeAddressFromDetailsNew)(data);
        },
        async getPlaceDetailsWithOriginLocale(placeId) {
            const responseOrigin = fetchPlaceDetails({
                placeId,
                sessionToken,
                languageCode: "en",
                googleApiKey
            });
            const responseLocalized = fetchPlaceDetails({
                placeId,
                sessionToken,
                languageCode,
                googleApiKey
            });
            const responses = await Promise.all([
                responseOrigin,
                responseLocalized,
            ]);
            const data = await Promise.all([
                responses[0].json(),
                responses[1].json()
            ]);
            sessionToken = (0, helpers_1.v4)();
            return {
                origin: (0, composeAddressFromDetailsNew_1.composeAddressFromDetailsNew)(data[0]),
                localized: (0, composeAddressFromDetailsNew_1.composeAddressFromDetailsNew)(data[1]),
            };
        }
    };
}
//# sourceMappingURL=placesAutocompleteNew.js.map