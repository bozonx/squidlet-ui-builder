import * as fs from 'node:fs/promises';
import path from 'node:path';
import {replaceExt} from 'squidlet-lib'
import {CODE_EXT, FILE_NAMES, Frameworks, ROOT_DIRS, SVELTE_EXT} from '../types/constants.js';
import {Output} from './Output.js';
import {BuilderOptions} from '../types/BuilderOptions.js';
import {fileExists, loadYamlFile} from '../helpers/common.js';
import {MakeRouter} from './MakeRouter.js';
import {FrameworkBuilder} from '../types/FrameworkBuilder.js';
import {SvelteBuilder} from './svelte/SvelteBuilder.js';


const builders: Record<Frameworks, new(main: BuilderMain) => FrameworkBuilder> = {
  svelte: SvelteBuilder
}


export class BuilderMain {
  readonly options: BuilderOptions
  readonly output = new Output(this)
  readonly router = new MakeRouter(this)
  readonly frameworkBuilder: FrameworkBuilder
  isInitialBuild = true


  constructor(options: BuilderOptions) {
    this.options = this.prepareOptions(options)
    this.frameworkBuilder = new builders[this.options.framework](this)
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
    await this.buildEntities(ROOT_DIRS.layouts, this.frameworkBuilder.buildLayout)
    await this.buildEntities(ROOT_DIRS.screens, this.frameworkBuilder.buildScreen)
    await this.buildEntities(ROOT_DIRS.components, this.frameworkBuilder.buildComponent)
    await this.output.createFile(
      ROOT_DIRS.app,
      FILE_NAMES.routes + CODE_EXT,
      await this.router.makeJs()
    )
  }


  private async buildEntities(entityDir: string, builder: (obj: any) => Promise<string>) {
    const srcDir = path.join(this.options.prjDir, entityDir)
    const entities = await fs.readdir(srcDir)

    for (const fileName of entities) {
      const obj: any = await loadYamlFile(this, entityDir, fileName)
      const content = await builder(obj)

      await this.output.createFile(entityDir, replaceExt(fileName, SVELTE_EXT), content)
    }
  }

  private prepareOptions(options: BuilderOptions): BuilderOptions {
    return {
      prjDir: path.join(process.cwd(), options.prjDir),
      outputDir: path.join(process.cwd(), options.outputDir),
      prjName: options.prjName,
      // svelte by default
      framework: 'svelte',
      force: options.force,
    }
  }

}
