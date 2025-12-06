import { readFile } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';
import { config } from 'dotenv';
import { resolve } from 'path';

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), '.env.local') });

/**
 * Скрипт для загрузки видео на Vercel Blob Storage
 *
 * Использование:
 * npx tsx scripts/upload-video.ts [путь-к-видео] [имя-файла-в-blob]
 *
 * Пример:
 * npx tsx scripts/upload-video.ts src/videos/only.mp4 videos/only.mp4
 */

async function uploadVideo() {
  try {
    // Проверяем наличие токена
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('❌ Ошибка: Токен BLOB_READ_WRITE_TOKEN не найден!');
      console.error('   Убедитесь, что файл .env.local существует и содержит токен.');
      console.error('   Или установите переменную окружения:');
      console.error('   export BLOB_READ_WRITE_TOKEN=your_token_here');
      process.exit(1);
    }

    // Получаем аргументы из командной строки
    const videoPath = process.argv[2] || 'src/videos/only.mp4';
    const blobFileName = process.argv[3] || `videos/${videoPath.split('/').pop()}`;

    console.log('📹 Начинаю загрузку видео...');
    console.log(`📁 Локальный путь: ${videoPath}`);
    console.log(`☁️  Имя в Blob: ${blobFileName}`);

    // Проверяем наличие файла
    const fullPath = join(process.cwd(), videoPath);
    console.log(`🔍 Проверяю файл: ${fullPath}`);

    // Читаем файл
    const videoBuffer = await readFile(fullPath);
    console.log(`✅ Файл прочитан, размер: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Загружаем в Blob Storage
    console.log('⬆️  Загружаю на Vercel Blob Storage...');
    const { url } = await put(blobFileName, videoBuffer, {
      access: 'public',
      contentType: 'video/mp4',
      addRandomSuffix: false,
    });

    console.log('\n🎉 Видео успешно загружено!');
    console.log(`🔗 URL: ${url}`);
    console.log(`\n💡 Используйте этот URL в вашем приложении:`);
    console.log(`   videoLink: "${url}"`);

    return url;
  } catch (error) {
    console.error('❌ Ошибка при загрузке видео:', error);
    if (error instanceof Error) {
      console.error('   Сообщение:', error.message);
    }
    process.exit(1);
  }
}

// Запускаем загрузку
uploadVideo();

