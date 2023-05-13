import {ComponentDefinition} from './Component.js';
import yaml from 'yaml';
import {STD_COMPONENTS} from './StdComponents.js';


// TODO: использовать пользовательские компоненты тоже


export class ComponentsPool {
  // line {stdComponentNameOrPathToUserComponent: ComponentDefinition}
  private parsedDefinitions: Record<string, ComponentDefinition> = {}


  getComponentDefinition(componentName: keyof typeof STD_COMPONENTS): ComponentDefinition {
    if (this.parsedDefinitions[componentName]) return this.parsedDefinitions[componentName]

    const definitionStr = STD_COMPONENTS[componentName]

    this.parsedDefinitions[componentName] = yaml.parse(definitionStr)

    return this.parsedDefinitions[componentName]
  }

}
