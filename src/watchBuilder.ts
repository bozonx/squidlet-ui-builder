import chokidar from 'chokidar';

/**
 * Отслеживает изменения в указанной директории
 * @param dir - путь к директории для отслеживания
 * @param cb - callback функция, которая будет вызвана при изменении файлов
 * @returns функция для остановки отслеживания
 */
export function watchBuilder(
  dir: string,
  cb: (path: string, event: string) => void
): () => void {
  // Проверяем входные параметры
  if (!dir) {
    throw new Error('Directory path is required');
  }
  if (typeof cb !== 'function') {
    throw new Error('Callback must be a function');
  }

  // Создаем наблюдатель с базовыми настройками
  const watcher = chokidar.watch(dir, {
    // TODO: add ignored node_modules
    ignored: /(^|[\/\\])\../, // игнорируем скрытые файлы
    persistent: true, // продолжаем наблюдение после завершения процесса
    ignoreInitial: true, // не вызываем события при первом сканировании
    awaitWriteFinish: {
      stabilityThreshold: 300, // ждем 300мс после последнего изменения
      pollInterval: 100, // проверяем каждые 100мс
    },
  });

  // Обработка ошибок
  watcher.on('error', (error) => {
    console.error('Error occurred while watching:', error);
  });

  // Отслеживаем все изменения файлов
  watcher.on('all', (event, path) => {
    try {
      cb(path, event);
    } catch (error) {
      console.error('Error in watch callback:', error);
    }
  });

  // Возвращаем функцию для остановки наблюдения
  return () => {
    watcher.close();
  };
}
