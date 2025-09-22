import { AddressProvider, SuggestionOption, PlaceDetailsWithOriginLocale, BaseProviderConfig, LanguageCode } from './base';
import { ReturnAddressObject, AddressComponent } from '../types';
import { composeAddressFromDetails } from '../composeAddressFromDetails';

const SUGGESTIONS_ENDPOINT = 'https://catalog.api.2gis.com/3.0/suggests';
const DETAILS_ENDPOINT = 'https://catalog.api.2gis.com/3.0/items/byid';

// Маппинг языковых кодов в формат 2GIS
const LANGUAGE_MAPPING: Record<LanguageCode, string> = {
  'en': 'en_US',
  'ru': 'ru_RU',
  'uk': 'uk_UA',
  'az': 'az_AZ',
  'hy': 'hy_AM',
  'ar': 'ar_AE',
  'ka': 'ka_GE',
  'be': 'be_BY',
  // Остальные языки мапим на английский как fallback
  'af': 'en_US', 'sq': 'en_US', 'am': 'en_US', 'eu': 'en_US', 'bn': 'en_US', 'bs': 'en_US', 
  'bg': 'en_US', 'my': 'en_US', 'ca': 'en_US', 'zh': 'en_US', 'zh-CN': 'en_US', 'zh-HK': 'en_US', 
  'zh-TW': 'en_US', 'hr': 'en_US', 'cs': 'en_US', 'da': 'en_US', 'nl': 'en_US', 'en-AU': 'en_US', 
  'en-GB': 'en_US', 'et': 'en_US', 'fa': 'en_US', 'fi': 'en_US', 'fil': 'en_US', 'fr': 'en_US', 
  'fr-CA': 'en_US', 'gl': 'en_US', 'de': 'en_US', 'el': 'en_US', 'gu': 'en_US', 'iw': 'en_US', 
  'hi': 'en_US', 'hu': 'en_US', 'is': 'en_US', 'id': 'en_US', 'it': 'en_US'
};

interface TwoGisSuggestItem {
  id: string;
  name: string;
  full_name?: string;
  address_name?: string;
  full_address_name?: string;
  point?: string | { lat: number; lon: number }; // Может быть строкой в suggest или объектом в byid
  address?: {
    components?: Array<{
      type: string;
      name: string;
    }>;
    postcode?: string;
  };
  adm_div?: Array<{
    type: string;
    name: string;
  }>;
  type: string;
}

interface TwoGisSuggestResponse {
  result: {
    items: TwoGisSuggestItem[];
    total: number;
  };
  meta: {
    code: number;
  };
}

export class TwoGisProvider implements AddressProvider {
  private lastSearchResults: Map<string, TwoGisSuggestItem> = new Map();

  constructor(
    private config: BaseProviderConfig
  ) {}

  async getSuggestions(query: string): Promise<SuggestionOption[]> {
    const locale = LANGUAGE_MAPPING[this.config.languageCode || 'en'];
    const pageSize = Math.min(this.config.searchLength || 10, 20); // 2GIS рекомендует не более 20

    const url = new URL(SUGGESTIONS_ENDPOINT);
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('q', query);
    url.searchParams.set('suggest_type', 'object'); // Ищем все типы объектов: адреса, места, организации
    url.searchParams.set('locale', locale);
    url.searchParams.set('page_size', pageSize.toString());
    // НЕ указываем region_id для глобального поиска по всем регионам
    // НЕ указываем fields для минимального набора данных в подсказках

    try {
      const response = await fetch(url.toString());
      const data = await response.json() as TwoGisSuggestResponse;

      // Обрабатываем ошибки без падения - возвращаем пустой массив
      if (data.meta.code !== 200) {
        console.warn(`2GIS API warning: ${data.meta.code} for query "${query}"`);
        return []; // Возвращаем пустой массив вместо ошибки
      }

      // Сохраняем результаты для возможного использования в getPlaceDetails
      data.result.items.forEach(item => {
        this.lastSearchResults.set(item.id, item);
      });

      return this.formatSuggestions(data.result.items);
      
    } catch (error) {
      // Логируем ошибку, но не падаем - возвращаем пустой массив
      console.warn(`2GIS API network error for query "${query}":`, error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<ReturnAddressObject> {
    // Используем Items API для получения деталей по ID
    const locale = LANGUAGE_MAPPING[this.config.languageCode || 'en'];
    
    const url = new URL(DETAILS_ENDPOINT);
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('id', placeId);
    url.searchParams.set('locale', locale);
    url.searchParams.set('fields', 'items.point,items.address_name,items.full_address_name,items.adm_div,items.address');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`2GIS API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as TwoGisSuggestResponse;

    if (data.meta.code !== 200 || !data.result.items.length) {
      throw new Error(`2GIS place not found: ${placeId}`);
    }

    return this.convertToReturnAddressObject(data.result.items[0], locale);
  }

  async getPlaceDetailsWithOriginLocale(placeId: string): Promise<PlaceDetailsWithOriginLocale> {
    // Получаем данные для оригинального языка (английский) и локализованной версии
    const originPromise = this.getPlaceDetailsInLocale(placeId, 'en_US');
    const localizedPromise = this.getPlaceDetailsInLocale(
      placeId, 
      LANGUAGE_MAPPING[this.config.languageCode || 'en']
    );

    const [origin, localized] = await Promise.all([originPromise, localizedPromise]);

    return {
      origin,
      localized
    };
  }

  private async getPlaceDetailsInLocale(placeId: string, locale: string): Promise<ReturnAddressObject> {
    const url = new URL(DETAILS_ENDPOINT);
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('id', placeId);
    url.searchParams.set('locale', locale);
    url.searchParams.set('fields', 'items.point,items.address_name,items.full_address_name,items.adm_div,items.address');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`2GIS API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as TwoGisSuggestResponse;

    if (data.meta.code !== 200 || !data.result.items.length) {
      throw new Error(`2GIS place not found: ${placeId}`);
    }

    return this.convertToReturnAddressObject(data.result.items[0], locale);
  }

  private formatSuggestions(items: TwoGisSuggestItem[]): SuggestionOption[] {
    return items
      .map(item => {
        const formattedAddress = item.full_address_name || item.address_name || item.full_name || item.name || `ID: ${item.id}`;
        return {
          formattedAddress,
          place_id: item.id,
        };
      })
      .filter(suggestion => suggestion.formattedAddress && !suggestion.formattedAddress.startsWith('ID:')); // Фильтруем объекты без названия
  }

  private convertToReturnAddressObject(item: TwoGisSuggestItem, locale: string): ReturnAddressObject {
    // Парсим координаты из разных форматов
    let coordinates: number[] | null = null;
    if (item.point) {
      if (typeof item.point === 'string') {
        // Формат из suggest API: "lat,lon"
        const [lat, lon] = item.point.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lon)) {
          coordinates = [lat, lon];
        }
      } else if (typeof item.point === 'object' && item.point.lat && item.point.lon) {
        // Формат из byid API: { lat: number, lon: number }
        coordinates = [item.point.lat, item.point.lon];
      }
    }

    // Преобразуем компоненты адреса 2GIS в формат Google Places
    const addressComponents: AddressComponent[] = [];
    
    // Добавляем административные единицы
    if (item.adm_div) {
      item.adm_div.forEach(adm => {
        let type = 'administrative_area_level_1';
        switch (adm.type) {
          case 'country':
            type = 'country';
            break;
          case 'region':
          case 'district':
            type = 'administrative_area_level_1';
            break;
          case 'city':
          case 'settlement':
            type = 'locality';
            break;
        }
        
        addressComponents.push({
          types: [type],
          longText: adm.name,
          shortText: adm.name,
        });
      });
    }

    // Добавляем компоненты адреса
    if (item.address?.components) {
      item.address.components.forEach(comp => {
        let type = 'route';
        switch (comp.type) {
          case 'street':
            type = 'route';
            break;
          case 'house':
            type = 'street_number';
            break;
        }
        
        addressComponents.push({
          types: [type],
          longText: comp.name,
          shortText: comp.name,
        });
      });
    }

    // Добавляем почтовый код если есть
    if (item.address?.postcode) {
      addressComponents.push({
        types: ['postal_code'],
        longText: item.address.postcode,
        shortText: item.address.postcode,
      });
    }

    // Создаем корректный formatted address
    let formattedAddress = item.address_name || item.full_name || item.name;
    
    // Если full_address_name содержит несколько адресов через " / ", берем первый
    if (item.full_address_name) {
      const addresses = item.full_address_name.split(' / ');
      formattedAddress = addresses[0].trim();
    }
    
    // Создаем объект в формате, совместимом с composeAddressFromDetails
    const placeData = {
      id: item.id,
      addressComponents,
      location: coordinates ? { latitude: coordinates[0], longitude: coordinates[1] } : { latitude: 0, longitude: 0 },
      types: [item.type],
      formattedAddress: formattedAddress,
      displayName: {
        text: item.name,
        languageCode: locale.split('_')[0], // Извлекаем язык из локали
      },
    };

    return composeAddressFromDetails(placeData);
  }
}
