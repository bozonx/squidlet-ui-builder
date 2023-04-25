import * as fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT_DIRS} from '../types/constants.js';
import {Output} from './Output.js';
import {makeRouteContent} from './svelte/makeRoute.js';
import {BuilderOptions} from '../types/BuilderOptions.js';


export class BuilderMain {
  readonly options: BuilderOptions
  readonly output = new Output(this)


  constructor(options: BuilderOptions) {
    this.options = options
  }


  async init() {
    await this.output.init()
  }

  async build() {
    // TODO: формируем svelte файл экрана и файл маршрута
    // TODO: если встречаем зависимые компоненты то подгружаем их в объект компонентов
    // TODO: компонента формируем 1 раз и далее уже его не трогаем если ещё раз встречается
    // TODO: так же с ресурсами - подключаем только 1 раз

    const routesDir = path.join(this.options.prjDir, ROOT_DIRS.routes)
    const routes = await fs.readdir(routesDir)

    for (const fileName of routes) {
      const content = await makeRouteContent(fileName)

      await this.output.write(fileName, ROOT_DIRS.routes, content)
    }

  }

}
