import yaml from 'yaml';
import {omitObj} from 'squidlet-lib';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {UI_COMPONENT_CLASSES} from './UiComponentsClasses.js';
import {AnyElement} from './interfaces/AnyElement.js';
import {STD_COMPONENTS} from './StdComponents.js';


export interface ComponentProp {
  // TODO: get normal props
  type: string | number
}

export interface ComponentDefinition {

  // TODO: add data, props etc

  tmpl: UiElementDefinitionBase
}


export class Component {
  private readonly componentDefinition: ComponentDefinition
  private readonly props: Record<string, ComponentProp>
  private readonly childrenComponents: Component[] = []


  constructor(
    componentDefinition: ComponentDefinition,
    props: Record<string, ComponentProp> = {}
  ) {
    this.componentDefinition = componentDefinition
    this.props = props
  }


  async init() {
    const tmpl: UiElementDefinitionBase = this.componentDefinition.tmpl
    const children: UiElementDefinitionBase[] = (typeof tmpl === 'object')
      ? [tmpl]
      : tmpl
    //const tmplRootComponentName = rootTmplElement.component

    for (const child of children) {
      const definitionStr = STD_COMPONENTS[child.component]
      const definition = yaml.parse(definitionStr)

      this.childrenComponents.push(
        new Component(definition, omitObj(child, 'component'))
      )
    }

    for (const component of this.childrenComponents) {
      await component.init()
    }
  }

  async destroy() {
    for (const component of this.childrenComponents) {
      await component.destroy()
    }
  }

}
