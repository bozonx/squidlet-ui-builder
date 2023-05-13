import {AnyElementDefinitions} from './AnyElementDefinition.js';


export interface UiElementDefinitionBase {
  type: keyof AnyElementDefinitions
}
