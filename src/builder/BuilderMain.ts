import * as fs from 'node:fs/promises';
import path from 'node:path';
import {ROOT_DIRS, SVELTE_EXT} from '../types/constants.js';
import {Output} from './Output.js';
import {makeScreenContent} from './svelte/makeScreen.js';
import {BuilderOptions} from '../types/BuilderOptions.js';
import {fileExists} from '../helpers/common.js';


export class BuilderMain {
  readonly options: BuilderOptions
  readonly output = new Output(this)
  isInitialBuild = true


  constructor(options: BuilderOptions) {
    this.options = this.prepareOptions(options)
  }


  async init() {
    await this.output.init()

    if (await fileExists(this.output.packageJsonPath)) {
      this.isInitialBuild = false
    }
  }

  async build() {
    await this.output.copyPeripheralStatic()
    await this.output.makePackageJson()
    await this.output.installDeps()
    await this.buildScreens()
  }


  private async buildScreens() {
    const screensDir = path.join(this.options.prjDir, ROOT_DIRS.screens)
    const screens = await fs.readdir(screensDir)

    for (const fileName of screens) {
      const content = await makeScreenContent(this, fileName)

      await this.output.write(ROOT_DIRS.screens, fileName, content, SVELTE_EXT)
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
