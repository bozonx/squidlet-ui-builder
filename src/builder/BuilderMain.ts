import * as fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT_DIRS} from '../types/constants.js';


export class BuilderMain {
  constructor() {
  }


  async build(prjPath: string) {
    // TODO: загружаем список файлов директории routes
    // TODO: проходимся по каждому route
    // TODO: формируем svelte файл экрана и файл маршрута
    // TODO: если встречаем зависимые компоненты то подгружаем их в объект компонентов
    // TODO: компонента формируем 1 раз и далее уже его не трогаем если ещё раз встречается
    // TODO: так же с ресурсами - подключаем только 1 раз

    const routesDir = path.join(prjPath, ROOT_DIRS.routes)
    const routes = await fs.readdir(routesDir)

    for (const fileName of routes) {
      console.log(111, fileName)
    }

  }

}
