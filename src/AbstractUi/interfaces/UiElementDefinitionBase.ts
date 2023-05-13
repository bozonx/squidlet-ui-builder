import {AnyElementDefinitions} from './AnyElementDefinition.js';


export interface UiElementDefinitionBase {
  component: keyof AnyElementDefinitions
}
