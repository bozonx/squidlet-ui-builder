import yaml from 'yaml';
import {omitObj} from 'squidlet-lib';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {STD_COMPONENTS} from './StdComponents.js';
import {componentPool} from './ComponentsPool.js';


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
  // TODO: сделать реактивными - добавить subscribe()
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
    // TODO: может это должно быть в конструкторе???
    this.instantiateChildren()

    for (const component of this.childrenComponents) {
      await component.init()
    }
  }

  async destroy() {
    for (const component of this.childrenComponents) {
      await component.destroy()
    }
  }


  private instantiateChildren() {
    const tmpl: UiElementDefinitionBase = this.componentDefinition.tmpl
    const children: UiElementDefinitionBase[] = (typeof tmpl === 'object')
      ? [tmpl]
      : tmpl
    //const tmplRootComponentName = rootTmplElement.component

    for (const child of children) {
      const definition = componentPool.getComponentDefinition(child.component)

      this.childrenComponents.push(
        new Component(definition, omitObj(child, 'component'))
      )
    }

  }

}
