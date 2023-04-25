import * as fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT_DIRS} from '../types/constants.js';
import {Output} from './Output.js';
import {makeRouteContent} from './svelte/makeRoute.js';
import {BuilderOptions} from '../types/BuilderOptions.js';


export class BuilderMain {
  readonly options: BuilderOptions
  readonly output = new Output(this)
  readonly mkdirP = async (dirName: string) => {
    // TODO: make it
    return mkdirPLogic(
      dirName,

    )
  }


  constructor(options: BuilderOptions) {
    this.options = options
  }


  async init() {
    await this.output.init()
  }

  async build() {
    const routesDir = path.join(this.options.prjDir, ROOT_DIRS.routes)
    const routes = await fs.readdir(routesDir)

    for (const fileName of routes) {
      const content = await makeRouteContent(fileName)

      await this.output.write(ROOT_DIRS.routes, fileName, content)
    }
  }

}
