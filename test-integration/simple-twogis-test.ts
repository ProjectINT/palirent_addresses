import dotenv from 'dotenv';
import fs from 'fs/promises';
import { createAddressAutocomplete } from '../src/addressAutocomplete';

dotenv.config();

async function testTwoGis() {
  const query = 'Цветной бульвар Сочи';
  console.log(`🔍 Тестируем 2GIS с запросом: "${query}"`);
  
  // Создаем провайдер 2GIS
  const twogis = createAddressAutocomplete({
    provider: 'twogis',
    apiKey: process.env.TWO_GIS_API_KEY!,
    languageCode: 'ru',
    searchLength: 5
  });

  try {
    // 1. Получаем список подсказок
    console.log('\n📋 Шаг 1: Получаем подсказки...');
    const suggestions = await twogis.getSuggestions(query);
    
    // Записываем подсказки на диск
    await fs.writeFile(
      './test-results/suggestions.json', 
      JSON.stringify(suggestions, null, 2)
    );
    console.log(`✅ Получено ${suggestions.length} подсказок, сохранено в suggestions.json`);
    
    if (suggestions.length === 0) {
      console.log('❌ Нет подсказок для обработки');
      return;
    }

    // 2. Выбираем первую подсказку и получаем детали
    const selectedSuggestion = suggestions[0];
    console.log(`\n🎯 Шаг 2: Получаем детали для: "${selectedSuggestion.formattedAddress}"`);
    console.log(`📍 Place ID: ${selectedSuggestion.place_id}`);
    
    const placeDetails = await twogis.getPlaceDetails(selectedSuggestion.place_id);
    
    // Записываем детали на диск
    await fs.writeFile(
      './test-results/place-details.json',
      JSON.stringify(placeDetails, null, 2)
    );
    
    console.log('✅ Детали места получены и сохранены в place-details.json');
    
    // 3. Показываем структуру ReturnAddressObject
    console.log('\n📊 Результат - структура ReturnAddressObject:');
    console.log('==================================================');
    console.log('ADDRESS (координаты и базовые данные):');
    console.log(`  ID: ${placeDetails.address.id}`);
    console.log(`  Координаты: ${placeDetails.address.coordinates}`);
    console.log(`  Номер дома: ${placeDetails.address.number || 'не указан'}`);
    console.log(`  Почтовый код: ${placeDetails.address.zip_code || 'не указан'}`);
    
    console.log('\nTRANSLATIONS (локализованные данные):');
    console.log(`  Язык: ${placeDetails.translations.locale}`);
    console.log(`  Полный адрес: ${placeDetails.translations.formatted_address}`);
    console.log(`  Страна: ${placeDetails.translations.country || 'не указана'}`);
    console.log(`  Регион: ${placeDetails.translations.state || 'не указан'}`);
    console.log(`  Город: ${placeDetails.translations.city || 'не указан'}`);
    console.log(`  Улица: ${placeDetails.translations.street || 'не указана'}`);
    
    console.log('\n🎉 Тест успешно завершен!');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
    
    // Записываем ошибку на диск для анализа
    const errorInfo = error instanceof Error ? {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    } : {
      error: String(error),
      timestamp: new Date().toISOString()
    };
    
    await fs.writeFile(
      './test-results/error.json',
      JSON.stringify(errorInfo, null, 2)
    );
  }
}

testTwoGis();
