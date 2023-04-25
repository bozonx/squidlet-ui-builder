import * as fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT_DIRS} from '../types/constants.js';
import {Output} from './Output.js';
import {makeRouteContent} from './helpers/makeRoute.js';


export class BuilderMain {
  readonly prjPath
  readonly output = new Output(this)


  constructor(prjPath: string) {
    this.prjPath = prjPath
  }


  async build() {
    // TODO: загружаем список файлов директории routes
    // TODO: проходимся по каждому route
    // TODO: формируем svelte файл экрана и файл маршрута
    // TODO: если встречаем зависимые компоненты то подгружаем их в объект компонентов
    // TODO: компонента формируем 1 раз и далее уже его не трогаем если ещё раз встречается
    // TODO: так же с ресурсами - подключаем только 1 раз

    const routesDir = path.join(prjPath, ROOT_DIRS.routes)
    const routes = await fs.readdir(routesDir)

    for (const fileName of routes) {
      const fullFileName = path.join(routesDir, fileName)
      console.log(111, fullFileName)

      const content = makeRouteContent()

      await this.output.write(fileName, ROOT_DIRS.routes, content)
    }

  }

}
