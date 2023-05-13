import {omitObj} from 'squidlet-lib';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {Main} from './Main.js';


export interface ComponentProp {
  // TODO: get normal props
  type: string | number
}

export interface ComponentDefinition {

  // TODO: add data, props etc

  tmpl: UiElementDefinitionBase
}


export class Component {
  private readonly main: Main
  private readonly componentDefinition: ComponentDefinition
  // TODO: сделать реактивными - добавить subscribe()
  private readonly props: Record<string, ComponentProp>
  private readonly childrenComponents: Component[] = []


  get children(): Component[] {
    return this.childrenComponents
  }


  constructor(
    main: Main,
    componentDefinition: ComponentDefinition,
    props: Record<string, ComponentProp> = {}
  ) {
    this.main = main
    this.componentDefinition = componentDefinition
    this.props = props

    this.instantiateChildren()
  }


  async init() {
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
      const definition = this.main.componentPool.getComponentDefinition(child.component)

      this.childrenComponents.push(
        new Component(this.main, definition, omitObj(child, 'component'))
      )
    }

  }

}
