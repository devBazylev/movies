import { put } from '@vercel/blob';

/**
 * Загружает файл в Vercel Blob Storage
 * @param fileName - Имя файла (например, 'articles/blob.txt')
 * @param content - Содержимое файла (строка, Blob, File, ArrayBuffer и т.д.)
 * @param options - Опции загрузки (access, contentType и т.д.)
 * @returns Promise с URL загруженного файла
 */
export const uploadToBlob = async (
  fileName: string,
  content: string | Blob | File | ArrayBuffer | Buffer,
  options?: {
    access?: 'public';
    contentType?: string;
    addRandomSuffix?: boolean;
  }
): Promise<string> => {
  try {
    const { url } = await put(fileName, content, {
      access: options?.access || 'public',
      contentType: options?.contentType,
      addRandomSuffix: options?.addRandomSuffix,
    });

    return url;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при загрузке файла в Blob Storage:', error);
    throw error;
  }
};

/**
 * Загружает файл из input элемента
 * @param file - Файл из input элемента
 * @param fileName - Имя файла (опционально, по умолчанию используется имя файла)
 * @returns Promise с URL загруженного файла
 */
export const uploadFileToBlob = async (
  file: File,
  fileName?: string
): Promise<string> => {
  const finalFileName = fileName || file.name;
  return uploadToBlob(finalFileName, file, {
    access: 'public',
    contentType: file.type,
  });
};

