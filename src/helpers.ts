import { placesTypes } from './placesTypes';
import { AddressComponent, AddressComponentNew } from './types';

interface PlaceNameArg {
  placeTypes: string[];
  displayName: string;
}

export const getPlaceName = ({ placeTypes, displayName }: PlaceNameArg): string => {
  if (!Array.isArray(placeTypes)) return '';

  for (const placeType of placeTypes) {
    if (placesTypes.includes(placeType)) {
      return `${displayName} `;
    }
  }
  return '';
};

export const getAddressComponentByType = (components: AddressComponent[], type: string): string => {
  if (!Array.isArray(components)) return '';

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

export const getAddressComponentByTypeNew = (components: AddressComponentNew[], type: string): string => {
  if (!Array.isArray(components)) return '';

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

export const v4 = (): string => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d/16);
      return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
  });
};
