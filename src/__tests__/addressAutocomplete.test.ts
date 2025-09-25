import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAddressAutocomplete } from '../addressAutocomplete';

// Mock fetch
global.fetch = vi.fn();

describe('Address Autocomplete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Google Provider', () => {
    it('should create Google provider', () => {
      const autocomplete = createAddressAutocomplete({
        provider: 'google',
        apiKey: 'test-key',
        languageCode: 'en',
      });

      expect(autocomplete).toBeDefined();
      expect(autocomplete.getSuggestions).toBeDefined();
      expect(autocomplete.getPlaceDetails).toBeDefined();
      expect(autocomplete.getPlaceDetailsWithOriginLocale).toBeDefined();
    });

    it('should fetch suggestions from Google API', async () => {
      const mockResponse = {
        suggestions: [
          {
            placePrediction: {
              text: { text: 'Moscow, Russia' },
              placeId: 'ChIJybDUc_xKtUYRTM9XV8zWRD0'
            }
          }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const autocomplete = createAddressAutocomplete({
        provider: 'google',
        apiKey: 'test-key',
        languageCode: 'en',
      });

      const suggestions = await autocomplete.getSuggestions('Moscow');

      expect(suggestions).toEqual([
        {
          formattedAddress: 'Moscow, Russia',
          place_id: 'ChIJybDUc_xKtUYRTM9XV8zWRD0'
        }
      ]);
    });
  });

  describe('2GIS Provider', () => {
    it('should create 2GIS provider', () => {
      const autocomplete = createAddressAutocomplete({
        provider: 'twogis',
        apiKey: 'test-key',
        languageCode: 'ru',
      });

      expect(autocomplete).toBeDefined();
      expect(autocomplete.getSuggestions).toBeDefined();
      expect(autocomplete.getPlaceDetails).toBeDefined();
      expect(autocomplete.getPlaceDetailsWithOriginLocale).toBeDefined();
    });

    it('should fetch suggestions from 2GIS API', async () => {
      const mockResponse = {
        result: {
          items: [
            {
              id: '141265770396328',
              name: 'Красная площадь',
              full_address_name: 'Москва, Красная площадь',
              type: 'building',
              point: '55.753215,37.622504'
            }
          ],
          total: 1
        },
        meta: {
          code: 200
        }
      };

      (fetch as any).mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      const autocomplete = createAddressAutocomplete({
        provider: 'twogis',
        apiKey: 'test-key',
        languageCode: 'ru',
      });

      const suggestions = await autocomplete.getSuggestions('Красная площадь');

      expect(suggestions).toEqual([
        {
          formattedAddress: 'Москва, Красная площадь',
          place_id: '141265770396328'
        }
      ]);
    });
  });

  describe('Provider Factory', () => {
    it('should throw error for unknown provider', () => {
      expect(() => {
        createAddressAutocomplete({
          provider: 'unknown' as any,
          apiKey: 'test-key',
        });
      }).toThrow('Unknown provider: unknown');
    });
  });
});
