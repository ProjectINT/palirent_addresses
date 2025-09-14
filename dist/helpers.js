"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v4 = exports.getAddressComponentByTypeNew = exports.getAddressComponentByType = exports.getPlaceName = void 0;
const placesTypes_1 = require("./placesTypes");
const getPlaceName = ({ placeTypes, displayName }) => {
    if (!Array.isArray(placeTypes))
        return '';
    for (const placeType of placeTypes) {
        if (placesTypes_1.placesTypes.includes(placeType)) {
            return `${displayName} `;
        }
    }
    return '';
};
exports.getPlaceName = getPlaceName;
const getAddressComponentByType = (components, type) => {
    if (!Array.isArray(components))
        return '';
    const component = components.find(({ types }) => types.includes(type));
    if (component) {
        if (component.long_name) {
            return component.long_name;
        }
        if (component.short_name) {
            return component.short_name;
        }
        return '';
    }
    return '';
};
exports.getAddressComponentByType = getAddressComponentByType;
const getAddressComponentByTypeNew = (components, type) => {
    if (!Array.isArray(components))
        return '';
    const component = components.find(({ types }) => types.includes(type));
    if (component) {
        if (component.longText) {
            return component.longText;
        }
        if (component.shortText) {
            return component.shortText;
        }
        return '';
    }
    return '';
};
exports.getAddressComponentByTypeNew = getAddressComponentByTypeNew;
const v4 = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};
exports.v4 = v4;
//# sourceMappingURL=helpers.js.map