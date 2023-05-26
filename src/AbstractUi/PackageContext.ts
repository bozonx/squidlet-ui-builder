import yaml from 'yaml';
import {Logger} from 'squidlet-lib'
import {Main} from './Main.js';
import {STD_COMPONENTS} from './stdLib/index.js';


export class PackageContext {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  setRouter() {
    this.main.setRouter()
  }

  setLogger(logger: Logger) {
    this.main.setLogger(logger)
  }

  registerComponentsLib(libName: string, components: Record<string, string>) {
    this.main.componentsManager.registerComponentsLib(libName)

    // like: {libName: {componentName: ComponentDefinitionString}}
    componentsLibsStr: Record<string, Record<string, string>> = {}


    const libs: Record<string, Record<string, string>> = {
      std: STD_COMPONENTS,
      ...componentsLibsStr
    }

    for (const libName of Object.keys(libs)) {
      for (const cmpName of Object.keys(libs[libName])) {
        this.componentsLib[cmpName] = yaml.parse(libs[libName][cmpName])
      }
    }

  }


}
