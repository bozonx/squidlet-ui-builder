import {Main} from './Main.js';
import {ComponentDefinition} from './Component.js';


export class ComponentsManager {
  private readonly main: Main
  // like: {pathToComponent: ComponentDefinition}
  private appComponentsDefinitions: Record<string, ComponentDefinition> = {}
  // like: {componentName: ComponentDefinition}
  private readonly componentsLib: Record<string, ComponentDefinition> = {}


  constructor(main: Main) {
    this.main = main
  }


  getDefinition(pathToComponent: string) {
    return this.appComponentsDefinitions[pathToComponent]
  }

  getComponentDefinition(pathOrStdComponentName: string): ComponentDefinition {

    //console.log(111, 'requested cmp - ', pathOrStdComponentName)

    if (this.appComponentsDefinitions[pathOrStdComponentName]) {
      return this.appComponentsDefinitions[pathOrStdComponentName]
    }
    else if (this.componentsLib[pathOrStdComponentName]) {
      return this.componentsLib[pathOrStdComponentName]
    }
    else {
      throw new Error(`Can't find component "${pathOrStdComponentName}"`)
    }
  }

  registerCompDefinitions(definitions: Record<string, ComponentDefinition>) {
    this.appComponentsDefinitions = definitions
  }

  registerComponentsLib(libName: string) {

  }

}
