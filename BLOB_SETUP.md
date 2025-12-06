# Настройка Vercel Blob Storage

## 📋 Что было сделано

Создан сервис для работы с Vercel Blob Storage:
- `src/services/blob-service.ts` - основной сервис для загрузки файлов
- `src/services/blob-service.example.ts` - примеры использования

## ⚙️ Настройка

### Вариант 1: Использование токена доступа (для разработки)

1. **Создайте хранилище Blob и получите токен:**
   
   **Шаг 1:** Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
   
   **Шаг 2:** Выберите ваш проект из списка
   
   **Шаг 3:** В верхнем меню проекта нажмите на вкладку **Storage** (Хранилище)
   
   **Шаг 4:** На странице Storage нажмите кнопку **Create Database** или **Connect Database**
   
   **Шаг 5:** В открывшемся окне:
   - Выберите **Blob** из списка доступных хранилищ
   - Нажмите **Continue** (Продолжить)
   - Введите имя для вашего хранилища (например, `movies-blob` или `images`)
   - Нажмите **Create** (Создать)
   
   **Шаг 6:** После создания хранилища Vercel **автоматически создаст** переменную окружения `BLOB_READ_WRITE_TOKEN` в вашем проекте
   
   **Шаг 7:** Проверьте, что токен уже добавлен автоматически:
   - Перейдите в **Settings** → **Environment Variables**
   - Найдите переменную `BLOB_READ_WRITE_TOKEN` в списке
   - Если она **ЕСТЬ и значение заполнено** ✅ - всё готово! Токен уже настроен
   
   **Если переменная ЕСТЬ, но значение ПУСТОЕ** ⚠️:
   
   **Решение 1:** Используйте Vercel CLI для получения токена:
   ```bash
   # Установите Vercel CLI (если еще не установлен)
   npm i -g vercel
   
   # Войдите в аккаунт
   vercel login
   
   # Свяжите локальный проект с проектом на Vercel
   vercel link
   # При запросе выберите ваш проект из списка
   
   # Получите все переменные окружения (включая токен)
   vercel env pull .env.local
   ```
   После этого откройте файл `.env.local` в корне проекта и скопируйте значение `BLOB_READ_WRITE_TOKEN`
   
   **Затем обновите переменную в Vercel Dashboard:**
   - Перейдите в **Settings** → **Environment Variables**
   - Найдите переменную `BLOB_READ_WRITE_TOKEN` в списке
   - Нажмите на неё для редактирования (или кнопку с иконкой карандаша/редактирования)
   - Вставьте скопированный токен в поле **Value**
   - Нажмите **Save** или **Update**
   
   **Или обновите через CLI:**
   ```bash
   # Удалите старую переменную (если значение пустое)
   vercel env rm BLOB_READ_WRITE_TOKEN production preview development
   
   # Добавьте переменную с токеном
   vercel env add BLOB_READ_WRITE_TOKEN production preview development
   # При запросе вставьте токен: vercel_blob_rw_zUV2Bk4rMrvmXbWX_gW8DgFJVsOWSIEuCw68RgqdZvXcBcl
   ```
   
   **Решение 2:** Пересоздайте хранилище Blob:
   - Удалите текущее хранилище в Storage
   - Создайте новое хранилище Blob
   - Токен должен автоматически заполниться
   
   **Решение 3 (рекомендуется для клиентского приложения):** Используйте серверный API endpoint (см. Вариант 2 ниже) - это безопаснее, чем хранить токен на клиенте
   
   **Если переменной НЕТ** ❌, то:
   
   **Вариант А (рекомендуется):** Используйте Vercel CLI для получения переменных:
   ```bash
   # Установите Vercel CLI (если еще не установлен)
   npm i -g vercel
   
   # Войдите в аккаунт
   vercel login
   
   # Получите все переменные окружения (включая токен)
   vercel env pull .env.local
   ```
   Это создаст файл `.env.local` с токеном `BLOB_READ_WRITE_TOKEN`
   
   **Вариант Б:** Для клиентского приложения (Vite/React) лучше использовать серверный API endpoint (см. Вариант 2 ниже), так как токен не должен быть доступен на клиенте из соображений безопасности
   
   **⚠️ ВАЖНО:** 
   - Токен **обычно автоматически добавляется** в Environment Variables после создания хранилища
   - Если токена нет в Environment Variables, проверьте, что хранилище Blob действительно создано и подключено к проекту
   - Для production лучше использовать серверный endpoint, а не хранить токен на клиенте

2. **Настройте переменные окружения:**
   Создайте файл `.env.local` в корне проекта:
   ```env
   VITE_BLOB_READ_WRITE_TOKEN=your_token_here
   ```

3. **Обновите сервис для использования токена:**
   Токен будет автоматически использоваться библиотекой `@vercel/blob` если он доступен в переменных окружения.

### Вариант 2: Создание серверного API endpoint (рекомендуется для production)

Для безопасности лучше создать серверный endpoint. Если вы используете Vercel, создайте API route:

**api/upload.ts** (если используете Next.js):
```typescript
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 });
  }

  const blob = await request.blob();
  const { url } = await put(filename, blob, {
    access: 'public',
  });

  return NextResponse.json({ url });
}
```

## 🚀 Использование

### Базовый пример:

```typescript
import { uploadToBlob } from '@/services/blob-service';

// Загрузка текста
const url = await uploadToBlob('articles/blob.txt', 'Hello World!', {
  access: 'public',
});
console.log('URL файла:', url);
```

### Загрузка файла из input:

```typescript
import { uploadFileToBlob } from '@/services/blob-service';

const handleFileUpload = async (file: File) => {
  try {
    const url = await uploadFileToBlob(file, `uploads/${file.name}`);
    console.log('Файл загружен:', url);
    // Используйте URL для сохранения в базе данных или отображения
  } catch (error) {
    console.error('Ошибка:', error);
  }
};
```

### Пример в React компоненте:

```typescript
import { useState } from 'react';
import { uploadFileToBlob } from '@/services/blob-service';

function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFileToBlob(file);
      setFileUrl(url);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Загрузка...</p>}
      {fileUrl && <a href={fileUrl}>Скачать файл</a>}
    </div>
  );
}
```

## 📝 Примечания

- **Безопасность**: Не храните токен доступа в клиентском коде для production
- **Лимиты**: Проверьте лимиты Vercel Blob Storage в вашем плане
- **Типы файлов**: Поддерживаются любые типы файлов (текст, изображения, видео и т.д.)

## 🔗 Полезные ссылки

- [Документация Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [API Reference](https://vercel.com/docs/storage/vercel-blob/using-the-sdk)

