import {ComponentDefinition} from './ComponentBase.js';

export interface SlotsDefinition {
  default?: ComponentDefinition[]
  [index: string]: ComponentDefinition[]
}


export class ComponentSlot {


  constructor(slotsDefinition: SlotsDefinition) {
  }

  async init(scope: Record<any, any>) {

  }

  async destroy() {

  }


}
