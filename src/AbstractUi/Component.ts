import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {UI_COMPONENT_CLASSES} from './UiComponentsClasses.js';
import {AnyElement} from './interfaces/AnyElement.js';
import {UiElement} from './interfaces/UiElement.js';


export interface ComponentDefinition {

  // TODO: add data, props etc

  tmpl: UiElementDefinitionBase
}


export class Component implements UiElement {
  private readonly componentDefinition: ComponentDefinition
  private readonly uiRoot: AnyElement


  constructor(componentDefinition: ComponentDefinition) {
    this.componentDefinition = componentDefinition

    const rootTmplElement: UiElementDefinitionBase = this.componentDefinition.tmpl
    const tmplRootComponentName = rootTmplElement.component

    // TODO: поидее тут должен быть ComponentDefinition

    this.uiRoot = new UI_COMPONENT_CLASSES[tmplRootComponentName](rootTmplElement)
  }


  async init() {
    await this.uiRoot.init()
  }

  async destroy() {
    await this.uiRoot.destroy()
  }

}
