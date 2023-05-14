import {omitObj} from 'squidlet-lib';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {Main} from './Main.js';


export interface ComponentProp {
  // TODO: get normal props
  // TODO: сделать реактивными - добавить subscribe()
  type: string | number
}

export interface ComponentDefinition {

  // TODO: add others component parameters

  props: ComponentProp
  tmpl?: UiElementDefinitionBase
  tmplExp?: string
}


// TODO: onUpdate event


export class Component {
  private readonly main: Main
  private readonly componentDefinition: ComponentDefinition
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
  }


  async init() {

    // TODO: run on init event

    await this.instantiateChildren()
    // init all the component
    for (const component of this.childrenComponents) {
      await component.init()
    }
  }

  async destroy() {
    for (const component of this.childrenComponents) {
      await component.destroy()
    }
  }


  async render() {
    // TODO: run onMount event
    // TODO: mount
    // TODO: наверное надо поднять событие монтирования

    this.main.emitRender()
  }

  async unmount() {
    // TODO: run onUnmount event
    // TODO: unmount
  }


  private async instantiateChildren() {
    if (this.componentDefinition.tmplExp) {

      // TODO: выполнить выражение

      return
    }
    else if (this.componentDefinition.tmpl) {
      const tmpl: UiElementDefinitionBase = this.componentDefinition.tmpl
      const children: UiElementDefinitionBase[] = (typeof tmpl === 'object')
        ? [tmpl]
        : tmpl
      //const tmplRootComponentName = rootTmplElement.component

      for (const child of children) {
        const definition = await this.main.componentPool
          .getComponentDefinition(child.component)

        this.childrenComponents.push(
          new Component(this.main, definition, omitObj(child, 'component'))
        )
      }
    }
  }

}
