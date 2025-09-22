/**
 * Интеграционный тест для реальных API провайдеров
 * 
 * Этот файл тестирует работу с реальными API Google Places и 2GIS
 * используя ключи из .env файла
 */

import * as dotenv from 'dotenv';
import { createAddressAutocomplete, ProviderType } from './src/index';

// Загружаем переменные окружения
dotenv.config();

interface TestCase {
  query: string;
  description: string;
  expectedResults?: number;
}

interface ProviderTestConfig {
  name: string;
  provider: ProviderType;
  apiKey: string;
  testCases: TestCase[];
}

const TEST_CONFIGS: ProviderTestConfig[] = [
  {
    name: '2GIS',
    provider: 'twogis',
    apiKey: process.env.TWO_GIS_API_KEY || '',
    testCases: [
      {
        query: 'Москва Красная площадь',
        description: 'Поиск знаменитого места в Москве',
        expectedResults: 3
      },
      {
        query: 'Новосибирск проспект Ленина',
        description: 'Поиск улицы в Новосибирске',
        expectedResults: 5
      },
      {
        query: 'Казань Кремль',
        description: 'Поиск достопримечательности в Казани',
        expectedResults: 2
      },
      {
        query: 'Екатеринбург центр',
        description: 'Поиск центра города',
        expectedResults: 3
      }
    ]
  },
  {
    name: 'Google Places',
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY || '',
    testCases: [
      {
        query: 'Moscow Red Square',
        description: 'Поиск знаменитого места в Москве (English)',
        expectedResults: 3
      },
      {
        query: 'New York Times Square',
        description: 'Поиск международной достопримечательности',
        expectedResults: 5
      },
      {
        query: 'Paris Eiffel Tower',
        description: 'Поиск Эйфелевой башни',
        expectedResults: 3
      },
      {
        query: 'Москва Красная площадь',
        description: 'Поиск на русском языке',
        expectedResults: 3
      }
    ]
  }
];

async function runProviderTests(config: ProviderTestConfig) {
  console.log(`\n🔍 Тестирование провайдера: ${config.name}`);
  console.log('='.repeat(50));

  if (!config.apiKey) {
    console.log(`❌ API ключ для ${config.name} не найден в .env файле`);
    return;
  }

  try {
    const autocomplete = createAddressAutocomplete({
      provider: config.provider,
      apiKey: config.apiKey,
      languageCode: 'ru',
      searchLength: 8
    });

    let successCount = 0;
    let totalTests = config.testCases.length;

    for (const testCase of config.testCases) {
      console.log(`\n📍 Тестируем: ${testCase.description}`);
      console.log(`   Запрос: "${testCase.query}"`);

      try {
        const startTime = Date.now();
        const suggestions = await autocomplete.getSuggestions(testCase.query);
        const duration = Date.now() - startTime;

        console.log(`   ✅ Найдено ${suggestions.length} результатов за ${duration}ms`);
        
        // Показываем первые несколько результатов
        suggestions.slice(0, 3).forEach((suggestion, index) => {
          console.log(`      ${index + 1}. ${suggestion.formattedAddress}`);
          console.log(`         ID: ${suggestion.place_id}`);
        });

        // Тестируем получение детальной информации для первого результата
        if (suggestions.length > 0) {
          try {
            console.log(`\n   📋 Получаем детали для первого результата...`);
            const details = await autocomplete.getPlaceDetails(suggestions[0].place_id);
            console.log(`   ✅ Детали получены:`);
            console.log(`      Координаты: ${details.address.coordinates}`);
            console.log(`      Адрес: ${details.translations.formatted_address}`);
            console.log(`      Город: ${details.translations.city}`);
            console.log(`      Страна: ${details.translations.country}`);
          } catch (detailsError) {
            console.log(`   ⚠️  Ошибка при получении деталей: ${detailsError}`);
          }
        }

        successCount++;
      } catch (error) {
        console.log(`   ❌ Ошибка: ${error}`);
      }
    }

    console.log(`\n📊 Результаты для ${config.name}: ${successCount}/${totalTests} тестов пройдено`);

  } catch (error) {
    console.log(`❌ Критическая ошибка при инициализации ${config.name}: ${error}`);
  }
}

async function compareProviders() {
  console.log(`\n🆚 Сравнение провайдеров`);
  console.log('='.repeat(50));

  const compareQueries = [
    'Москва Красная площадь',
    'Новосибирск центр',
    'Санкт-Петербург Невский проспект'
  ];

  for (const query of compareQueries) {
    console.log(`\n🔎 Сравниваем результаты для: "${query}"`);
    
    // Создаем провайдеры
    const providers = [
      {
        name: '2GIS',
        autocomplete: createAddressAutocomplete({
          provider: 'twogis',
          apiKey: process.env.TWO_GIS_API_KEY || '',
          languageCode: 'ru'
        })
      },
      {
        name: 'Google',
        autocomplete: createAddressAutocomplete({
          provider: 'google',
          apiKey: process.env.GOOGLE_API_KEY || '',
          languageCode: 'ru'
        })
      }
    ];

    for (const provider of providers) {
      try {
        const startTime = Date.now();
        const suggestions = await provider.autocomplete.getSuggestions(query);
        const duration = Date.now() - startTime;

        console.log(`\n   ${provider.name} (${duration}ms):`);
        suggestions.slice(0, 3).forEach((s, i) => {
          console.log(`     ${i + 1}. ${s.formattedAddress}`);
        });
      } catch (error) {
        console.log(`   ${provider.name}: ❌ ${error}`);
      }
    }
  }
}

async function testLocalization() {
  console.log(`\n🌍 Тестирование локализации`);
  console.log('='.repeat(50));

  const testQuery = 'Москва Красная площадь';
  
  try {
    // Тестируем Google с разными языками
    const googleAutocomplete = createAddressAutocomplete({
      provider: 'google',
      apiKey: process.env.GOOGLE_API_KEY || '',
      languageCode: 'ru'
    });

    console.log(`\n📍 Google Places - тест локализации для: "${testQuery}"`);
    
    const suggestions = await googleAutocomplete.getSuggestions(testQuery);
    if (suggestions.length > 0) {
      const localized = await googleAutocomplete.getPlaceDetailsWithOriginLocale(suggestions[0].place_id);
      
      console.log(`\n   🇺🇸 Оригинал (EN):`);
      console.log(`      ${localized.origin.translations.formatted_address}`);
      console.log(`      Страна: ${localized.origin.translations.country}`);
      
      console.log(`\n   🇷🇺 Локализованный (RU):`);
      console.log(`      ${localized.localized.translations.formatted_address}`);
      console.log(`      Страна: ${localized.localized.translations.country}`);
    }
  } catch (error) {
    console.log(`❌ Ошибка тестирования локализации: ${error}`);
  }
}

async function runAllTests() {
  console.log('🚀 Запуск интеграционных тестов провайдеров адресов');
  console.log('🔑 Используем реальные API ключи из .env файла');
  console.log('='.repeat(60));

  // Проверяем наличие ключей
  console.log('\n🔐 Проверка API ключей:');
  console.log(`  2GIS API Key: ${process.env.TWO_GIS_API_KEY ? '✅ Найден' : '❌ Не найден'}`);
  console.log(`  Google API Key: ${process.env.GOOGLE_API_KEY ? '✅ Найден' : '❌ Не найден'}`);

  // Запускаем тесты для каждого провайдера
  for (const config of TEST_CONFIGS) {
    await runProviderTests(config);
    // Небольшая пауза между провайдерами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Сравнение провайдеров
  await compareProviders();

  // Тестирование локализации
  await testLocalization();

  console.log('\n🎉 Все тесты завершены!');
}

// Запускаем тесты
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Критическая ошибка:', error);
    process.exit(1);
  });
}

export { runAllTests, runProviderTests, compareProviders, testLocalization };
