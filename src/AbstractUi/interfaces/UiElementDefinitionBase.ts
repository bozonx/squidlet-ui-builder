import {AnyElementDefinitions} from './AnyElementDefinition.js';


export interface UiElementDefinitionBase {
  component: keyof AnyElementDefinitions
  slot?: UiElementDefinition[]
}

export interface UiElementDefinition extends UiElementDefinitionBase {
  // props
  [index: string]: any
}
