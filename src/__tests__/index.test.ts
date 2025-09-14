import { describe, test, expect } from 'vitest';
import { placesTypes, getPlaceName, v4 } from '../index';

describe('Address module', () => {
  test('placesTypes should be an array', () => {
    expect(Array.isArray(placesTypes)).toBe(true);
    expect(placesTypes.length).toBeGreaterThan(0);
  });

  test('getPlaceName should return correct place name', () => {
    const result = getPlaceName({
      placeTypes: ['restaurant'],
      displayName: 'Test Restaurant'
    });
    expect(result).toBe('Test Restaurant ');
  });

  test('v4 should generate UUID-like string', () => {
    const uuid = v4();
    expect(typeof uuid).toBe('string');
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});
