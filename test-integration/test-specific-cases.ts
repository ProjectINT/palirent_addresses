import dotenv from 'dotenv';
import fs from 'fs/promises';
import { createAddressAutocomplete } from '../src/addressAutocomplete';

dotenv.config();

async function testSpecificCases() {
  console.log('🔍 Тестируем специфические случаи 2GIS');
  
  const twogis = createAddressAutocomplete({
    provider: 'twogis',
    apiKey: process.env.TWO_GIS_API_KEY!,
    languageCode: 'ru',
    searchLength: 10
  });

  const testCases = [
    'Цветной бульвар 34', // Проблемный случай - точный адрес
    'Сочи Цветной бульвар', // С указанием города
    'Цветной бульвар Сочи', // Другой порядок
    'Цветной бульвар', // Общий запрос
    'Красная Поляна', // Известное место в Сочи
    'Олимпийский парк Сочи', // Другое известное место
  ];

  const results: any[] = [];

  for (const query of testCases) {
    console.log(`\n📍 Тестируем: "${query}"`);
    
    try {
      const suggestions = await twogis.getSuggestions(query);
      console.log(`  ✅ Найдено ${suggestions.length} результатов`);
      
      if (suggestions.length > 0) {
        suggestions.slice(0, 3).forEach((suggestion, index) => {
          console.log(`    ${index + 1}. ${suggestion.formattedAddress}`);
        });
      } else {
        console.log(`    ℹ️  Нет результатов для "${query}"`);
      }
      
      results.push({
        query,
        success: true,
        count: suggestions.length,
        suggestions: suggestions.slice(0, 5) // Сохраняем первые 5
      });
      
    } catch (error) {
      console.log(`  ❌ Ошибка: ${error}`);
      results.push({
        query,
        success: false,
        error: String(error)
      });
    }
  }
  
  // Сохраняем все результаты
  await fs.writeFile(
    './test-results/specific-cases-test.json', 
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n🎉 Тест завершен! Результаты сохранены в specific-cases-test.json');
  
  // Статистика
  const successCount = results.filter(r => r.success && r.count > 0).length;
  const noResultsCount = results.filter(r => r.success && r.count === 0).length;
  const errorsCount = results.filter(r => !r.success).length;
  
  console.log('\n📊 Статистика:');
  console.log(`  ✅ Успешные запросы с результатами: ${successCount}`);
  console.log(`  ℹ️  Успешные запросы без результатов: ${noResultsCount}`);
  console.log(`  ❌ Ошибки: ${errorsCount}`);
}

testSpecificCases().catch(console.error);
