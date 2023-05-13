import {AnyElementDefinition} from './interfaces/AnyElementDefinition.js';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {ELEMENT_TYPES} from './ElementTypes.js';
import {AnyElement} from './interfaces/AnyElement.js';
import {UiElement} from './interfaces/UiElement.js';


export interface ComponentDefinition {
  tmpl: AnyElementDefinition
}


export class Component implements UiElement {
  private readonly componentDefinition: ComponentDefinition
  private readonly uiRoot: AnyElement


  constructor(componentDefinition: ComponentDefinition) {
    this.componentDefinition = componentDefinition

    const rootTmplElement: UiElementDefinitionBase = this.componentDefinition.tmpl
    const tmplRootComponentName = rootTmplElement.component

    this.uiRoot = new ELEMENT_TYPES[tmplRootComponentName](rootTmplElement)
  }


  async init() {
    await this.uiRoot.init()
  }

  async destroy() {
    await this.uiRoot.destroy()
  }

}
