import {ComponentDefinition} from './Component.js';
import yaml from 'yaml';
import {STD_COMPONENTS} from './StdComponents.js';


export class ComponentsPool {


  getComponentDefinition(name: keyof typeof STD_COMPONENTS): ComponentDefinition {
    const definitionStr = STD_COMPONENTS[name]

    // TODO: использовать пользовательские компоненты тоже
    // TODO: кэшироввать

    return yaml.parse(definitionStr)
  }
}
