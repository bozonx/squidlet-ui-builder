import yaml from 'yaml';
import {STD_COMPONENTS} from '../src/AbstractUi/StdComponents';
import {ComponentDefinition} from '../src/AbstractUi/ComponentBase';


// TODO: не нужно походу
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

    console.log(111, 'got comp def - ', componentName)

    this.parsedDefinitions[componentName] = yaml.parse(definitionStr)

    return this.parsedDefinitions[componentName]
  }

}
