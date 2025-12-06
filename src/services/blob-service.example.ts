/* eslint-disable no-console */
/**
 * ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ VERCEL BLOB SERVICE
 *
 * ВАЖНО: Для работы с Vercel Blob на клиенте вам нужно:
 * 1. Создать API route на сервере (если используете Next.js)
 * 2. Или использовать токен доступа (BLOB_READ_WRITE_TOKEN)
 *
 * Для получения токена:
 * 1. Перейдите в Vercel Dashboard
 * 2. Выберите ваш проект
 * 3. Перейдите в Settings -> Environment Variables
 * 4. Добавьте переменную BLOB_READ_WRITE_TOKEN
 */

import { uploadToBlob, uploadFileToBlob } from './blob-service';

// ПРИМЕР 1: Загрузка текстового файла
export const exampleUploadText = async () => {
  try {
    const url = await uploadToBlob('articles/blob.txt', 'Hello World!', {
      access: 'public',
    });
    console.log('Файл загружен:', url);
    return url;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};

// ПРИМЕР 2: Загрузка файла из input элемента
export const exampleUploadFile = async (file: File) => {
  try {
    const url = await uploadFileToBlob(file, `uploads/${file.name}`);
    console.log('Файл загружен:', url);
    return url;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};

// ПРИМЕР 3: Загрузка изображения с указанием типа контента
export const exampleUploadImage = async (imageFile: File) => {
  try {
    const url = await uploadToBlob(
      `images/${imageFile.name}`,
      imageFile,
      {
        access: 'public',
        contentType: imageFile.type, // например, 'image/jpeg'
      }
    );
    console.log('Изображение загружено:', url);
    return url;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};

// ПРИМЕР 4: Использование в React компоненте
/*
import { useState } from 'react';
import { uploadFileToBlob } from '@/services/blob-service';

function FileUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFileToBlob(file);
      setFileUrl(url);
      console.log('Файл загружен успешно:', url);
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Загрузка...</p>}
      {fileUrl && (
        <div>
          <p>Файл загружен:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
}
*/

