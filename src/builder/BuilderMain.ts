import * as fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT_DIRS, SVELTE_EXT} from '../types/constants.js';
import {Output} from './Output.js';
import {makeRouteContent} from './svelte/makeRoute.js';
import {BuilderOptions} from '../types/BuilderOptions.js';


export class BuilderMain {
  readonly options: BuilderOptions
  readonly output = new Output(this)


  constructor(options: BuilderOptions) {
    this.options = this.prepareOptions(options)
  }


  async init() {
    await this.output.init()
  }

  async build() {
    const routesDir = path.join(this.options.prjDir, ROOT_DIRS.routes)
    const routes = await fs.readdir(routesDir)

    for (const fileName of routes) {
      const content = await makeRouteContent(this, fileName)

      await this.output.write(ROOT_DIRS.routes, fileName, content, SVELTE_EXT)
    }
  }


  private prepareOptions(options: BuilderOptions): BuilderOptions {
    return {
      ...options,
      prjDir: path.join(process.cwd(), options.prjDir),
      outputDir: path.join(process.cwd(), options.outputDir),
    }
  }

}
