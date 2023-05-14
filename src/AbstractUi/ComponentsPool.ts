import {ComponentDefinition} from './Component.js';
import yaml from 'yaml';
import {STD_COMPONENTS} from './StdComponents.js';


// TODO: использовать пользовательские компоненты тоже


export class ComponentsPool {
  // line {stdComponentNameOrPathToUserComponent: ComponentDefinition}
  private parsedDefinitions: Record<string, ComponentDefinition> = {}


  async getComponentDefinition(
    componentName: keyof typeof STD_COMPONENTS
  ): Promise<ComponentDefinition> {
    if (this.parsedDefinitions[componentName]) return this.parsedDefinitions[componentName]

    // TODO: подгружать описание компонента

    const definitionStr = STD_COMPONENTS[componentName]

    console.log(111, componentName, definitionStr)

    this.parsedDefinitions[componentName] = yaml.parse(definitionStr)

    return this.parsedDefinitions[componentName]
  }

}
