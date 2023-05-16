import {UiElementDefinition} from './interfaces/UiElementDefinitionBase.js';


export interface SlotsDefinition {
  default?: UiElementDefinition[]
  [index: string]: UiElementDefinition[] | undefined
}


export class ComponentSlot {


  constructor(slotsDefinition: SlotsDefinition) {
  }

  async init(scope: Record<any, any>) {

  }

  async destroy() {

  }


}
