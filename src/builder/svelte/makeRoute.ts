import path from 'node:path';


export async function makeRouteContent(fileName: string): Promise<string> {
  const fullFileName = path.join(routesDir, fileName)
  // TODO: формируем svelte файл экрана и файл маршрута
  // TODO: если встречаем зависимые компоненты то подгружаем их в объект компонентов
  // TODO: компонента формируем 1 раз и далее уже его не трогаем если ещё раз встречается
  // TODO: так же с ресурсами - подключаем только 1 раз

}
