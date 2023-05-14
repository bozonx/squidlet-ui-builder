import {omitObj, makeUniqId} from 'squidlet-lib';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {COMPONENT_EVENT_PREFIX, Main} from './Main.js';
import {IncomeEvents, OutcomeEvents} from './interfaces/DomEvents.js';
import {COMPONENT_ID_BYTES_NUM, ELEMENT_ID_BYTES_NUM} from './interfaces/constants.js';
import {RenderedElement} from './interfaces/RenderedElement.js';


// TODO: поддержка перемещения элементов


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


export class Component {
  // componentId
  readonly id: string
  // id of UI element which is represents this component
  readonly uiElId: string
  // component name. The same as in template and component class
  readonly name: string
  readonly parent: Component
  // TODO: наверное лучше сделать {componentId: Component} для быстрого доступа
  readonly children: Component[] = []
  readonly props: Record<string, ComponentProp>

  private readonly main: Main
  // initial component definition
  private readonly componentDefinition: ComponentDefinition
  private incomeEventListenerIndex?: number
  private childrenPositions: string[] = []


  constructor(
    main: Main,
    parent: Component,
    componentDefinition: ComponentDefinition,
    props: Record<string, ComponentProp> = {}
  ) {
    this.id = makeUniqId(COMPONENT_ID_BYTES_NUM)
    this.uiElId = makeUniqId(ELEMENT_ID_BYTES_NUM)
    this.main = main
    this.parent = parent
    this.componentDefinition = componentDefinition
    this.props = props
  }


  async init() {

    // TODO: run onInit callback

    await this.instantiateChildren()
    // init all the children components
    for (const component of this.children) {
      await component.init()
    }
    // fill initial elements' positions
    this.childrenPositions = this.children.map((component) => component.uiElId)
  }

  async destroy() {
    this.main.incomeEvents.removeListener(this.incomeEventListenerIndex)

    for (const component of this.children) {
      await component.destroy()
    }
  }


  /**
   * Get position of child by it's UI el id.
   * -1 means - can't find child
   */
  getPositionOfChildrenEl(childrenElId: string): number {
    return this.childrenPositions.indexOf(childrenElId)
  }

  /**
   * Mount rendered elements and it's children and start listening income events
   */
  async mount(rootElId: string, childPosition: number) {

    // TODO: корень разве здесь должен устанавливаться???

    // start listening income events
    this.incomeEventListenerIndex = this.main.incomeEvents.addListener(
      COMPONENT_EVENT_PREFIX + this.id,
      this.handleIncomeEvent
    )

    // TODO: call onMount component's callback

    this.main.outcomeEvents.emit(OutcomeEvents.mount, this.makeRenderedEl())
  }

  /**
   * Unmount rendered elements and it's children and stop listening incoming events.
   * But the component won't be destroyed
   */
  async unmount() {
    // stop listening income events
    this.main.incomeEvents.removeListener(this.incomeEventListenerIndex)

    // TODO: run onUnmount callback

    this.main.outcomeEvents.emit(OutcomeEvents.unMount, this.makeRenderedEl())
  }

  async update() {
    // TODO: run onUpdate callback

    this.main.outcomeEvents.emit(OutcomeEvents.update, this.makeRenderedEl())
  }


  private handleIncomeEvent = (event: IncomeEvents, elementId: string, ...data: any[]) => {
    switch (event) {
      case IncomeEvents.click:

        console.log(11111, 'click', elementId, ...data)

        // TODO: what to do ???

        break;
    }
  }

  private async instantiateChildren() {
    if (this.componentDefinition.tmplExp) {

      // TODO: выполнить выражение

      console.log(22222, 'ext', this.componentDefinition.tmplExp)

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

        this.children.push(
          new Component(this.main, this, definition, omitObj(child, 'component'))
        )
      }
    }
  }

  private makeRenderedEl(): RenderedElement {

    // TODO: resurse пройтись по потомкам и запросить у них tmpl. - только на mount

    const el = {

      // TODO: make params

      elId: this.uiElId,
      elName: this.name,
      parentElId: this.parent.uiElId,
      parentChildPosition: this.parent.getPositionOfChildrenEl(this.uiElId),
      componentId: this.id,

      // TODO: add
      // // params for rendered element
      // params?: Record<string, any>
      // TODO: add
      // children?: RenderedElement[]
    }

    return el
  }

}
