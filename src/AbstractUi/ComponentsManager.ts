import yaml from 'yaml';
import {Main} from './Main.js';
import {ComponentDefinition} from './Component.js';
import {STD_COMPONENTS} from './stdLib/index.js';


export class ComponentsManager {
  private readonly main: Main
  // User defined components. like: {pathToComponent: ComponentDefinition}
  private appComponents: Record<string, ComponentDefinition> = {}
  // Components of registered libs. like: {componentName: ComponentDefinition}
  private readonly componentsLib: Record<string, ComponentDefinition> = {}


  constructor(main: Main) {
    this.main = main

    this.registerComponentsLib(STD_COMPONENTS)
  }


  getDefinition(pathToComponent: string) {
    return this.appComponents[pathToComponent]
  }

  getComponentDefinition(pathOrStdComponentName: string): ComponentDefinition {

    //console.log(111, 'requested cmp - ', pathOrStdComponentName)

    // first try to get user defined component
    if (this.appComponents[pathOrStdComponentName]) {
      return this.appComponents[pathOrStdComponentName]
    }
    // if not found then get component from lib
    else if (this.componentsLib[pathOrStdComponentName]) {
      return this.componentsLib[pathOrStdComponentName]
    }
    else {
      throw new Error(`Can't find component "${pathOrStdComponentName}"`)
    }
  }

  registerAppComponents(components: Record<string, string | ComponentDefinition>) {
    for (const cmpName of Object.keys(components)) {
      const cmp = components[cmpName]

      if (typeof cmp === 'string') {
        this.appComponents[cmpName] = yaml.parse(cmp)
      }
      else if (typeof cmp === 'object') {
        this.appComponents[cmpName] = cmp
      }
    }
  }

  registerComponentsLib(components: Record<string, string | ComponentDefinition>) {
    for (const cmpName of Object.keys(components)) {
      const cmp = components[cmpName]

      if (typeof cmp === 'string') {
        this.componentsLib[cmpName] = yaml.parse(cmp)
      }
      else if (typeof cmp === 'object') {
        this.componentsLib[cmpName] = cmp
      }
    }
  }

}
