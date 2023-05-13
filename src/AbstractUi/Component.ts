import {AnyElementDefinition} from './interfaces/AnyElementDefinition.js';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {ELEMENT_TYPES} from './ElementTypes.js';
import {AnyElement} from './interfaces/AnyElement.js';


export interface ComponentDefinition {
  tmpl: AnyElementDefinition
}


export class Component {
  private readonly componentDefinition: ComponentDefinition
  private readonly uiRoot: AnyElement


  constructor(componentDefinition: ComponentDefinition) {
    this.componentDefinition = componentDefinition

    const rootTmplElement: UiElementDefinitionBase = this.componentDefinition.tmpl
    const tmplRootElType = rootTmplElement.type

    this.uiRoot = new ELEMENT_TYPES[tmplRootElType](rootTmplElement)
  }


  async init() {
    await this.uiRoot.init()
  }

}
