import * as fs from 'node:fs/promises';
import path from 'node:path';
import {pathTrimExt, replaceExt} from 'squidlet-lib'
import {
  CODE_EXT,
  DEFAULT_BUILD_DIR,
  FILE_NAMES,
  Frameworks,
  ROOT_DIRS,
  SVELTE_EXT,
  YAML_EXT
} from '../types/constants.ts';
import {Output} from './Output.ts';
import {BuilderOptions} from '../types/BuilderOptions.ts';
import {fileExists, loadPrjYamlFile, loadYamlFile} from './buildHelpers.ts';
import {MakeRouter} from './MakeRouter.ts';
import {FrameworkBuilder} from '../types/FrameworkBuilder.ts';
import {SvelteBuilder} from './svelte/SvelteBuilder.ts';
import {fileURLToPath} from 'url';
import {LibCfg} from '../types/LibCfg.ts';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const builders: Record<Frameworks, new(main: BuilderMain) => FrameworkBuilder> = {
  svelte: SvelteBuilder
}


export class BuilderMain {
  readonly options: BuilderOptions
  readonly output = new Output(this)
  readonly router = new MakeRouter(this)
  readonly frameworkBuilder: FrameworkBuilder
  isInitialBuild = true
  prjComponentNames: string[] = []
  libsComponentNames: Record<string, string[]> = {}
  // {libPrefix: '/path/to/file'}
  libsPaths: Record<string, string> = {}


  constructor(options: Partial<BuilderOptions>) {
    this.options = this.prepareOptions(options)
    this.frameworkBuilder = new builders[this.options.framework](this)
  }


  async init() {
    await this.output.init()

    this.prjComponentNames = (await fs.readdir(path.join(this.options.prjDir, ROOT_DIRS.components)))
      .map((el) => pathTrimExt(el))

    await this.collectCmpLibComponentNamesAndPaths()

    if (await fileExists(this.output.packageJsonPath)) {
      this.isInitialBuild = false
    }
  }

  async build() {
    await this.output.copyPeripheralStatic()
    await this.output.makePackageJson()
    await this.output.installDeps()
    await this.output.buildSystem()
    await this.output.buildUserLib()
    await this.buildComponentLibs(this.frameworkBuilder.buildComponent)
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
      const obj: any = await loadPrjYamlFile(this, entityDir, fileName)
      const content = await builder(obj)

      await this.output.createFile(entityDir, replaceExt(fileName, SVELTE_EXT), content)
    }
  }

  private async buildComponentLibs(builder: (obj: any) => Promise<string>) {
    for (const libName of Object.keys(this.libsComponentNames)) {
      for (const cmpName of this.libsComponentNames[libName]) {
        const obj: any = await loadYamlFile(path.join(this.libsPaths[libName], cmpName + YAML_EXT))
        const content = await builder(obj)

        await this.output.createFile(
          path.join(ROOT_DIRS.componentLibs, libName),
          cmpName + SVELTE_EXT,
          content
        )
      }

    }
  }

  private async collectCmpLibComponentNamesAndPaths() {
    for (const libPath of this.options.componentLibPaths) {
      const cfgFileName = FILE_NAMES.cfg + YAML_EXT
      const libCfgPath = path.join(libPath, cfgFileName)
      const libCfgObj: LibCfg = await loadYamlFile(libCfgPath)
      const componentsFileNames = (await fs.readdir(libPath))
        .filter((el) => el !== cfgFileName)

      this.libsComponentNames[libCfgObj.libPrefix] = componentsFileNames
        .map((el) => pathTrimExt(el))
      this.libsPaths[libCfgObj.libPrefix] = libPath
    }
  }

  private prepareOptions(options: Partial<BuilderOptions>): BuilderOptions {
    if (!options.prjName) throw new Error(`No prjName`)
    else if (!options.prjDir) throw new Error(`No prjDir`)

    return {
      prjDir: path.join(process.cwd(), options.prjDir),
      outputDir: path.join(process.cwd(), options.outputDir || DEFAULT_BUILD_DIR),
      prjName: options.prjName,
      // svelte by default
      framework: options.framework || 'svelte',
      force: Boolean(options.force),
      componentLibPaths: [
        ...options.componentLibPaths || [],
        path.resolve(__dirname, '../stdComponentsLib')
      ]
    }
  }

}
