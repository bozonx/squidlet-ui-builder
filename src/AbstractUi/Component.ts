import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {UI_COMPONENT_CLASSES} from './UiComponentsClasses.js';
import {AnyElement} from './interfaces/AnyElement.js';


export interface ComponentDefinition {

  // TODO: add data, props etc

  tmpl: UiElementDefinitionBase
}


export class Component {
  private readonly componentDefinition: ComponentDefinition
  private readonly childrenComponents: Component[] = []
  //private readonly uiRoot: AnyElement



  constructor(componentDefinition: ComponentDefinition) {
    this.componentDefinition = componentDefinition

    const tmpl: UiElementDefinitionBase = this.componentDefinition.tmpl
    const children: UiElementDefinitionBase[] = (typeof tmpl === 'object')
      ? [tmpl]
      : tmpl
    //const tmplRootComponentName = rootTmplElement.component

    for (const child of children) {
      childrenComponents.push(new Component(child))
    }

    // TODO: поидее тут должен быть ComponentDefinition

    //this.uiRoot = new UI_COMPONENT_CLASSES[tmplRootComponentName](rootTmplElement)
  }


  async init() {
    //await this.uiRoot.init()
  }

  async destroy() {
    await this.uiRoot.destroy()
  }

}
