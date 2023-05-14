import {omitObj, makeUniqId} from 'squidlet-lib';
import {UiElementDefinition} from './interfaces/UiElementDefinitionBase.js';
import {COMPONENT_EVENT_PREFIX, Main} from './Main.js';
import {IncomeEvents, OutcomeEvents} from './interfaces/DomEvents.js';
import {COMPONENT_ID_BYTES_NUM, ELEMENT_ID_BYTES_NUM} from './interfaces/constants.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {PropDefinition, UiProps} from './UiProps.js';
import {StateDefinition, UiState} from './UiState.js';


// TODO: поддержка перемещения элементов
// TODO: use <PropsDef = Record<string, any>> ???
// TODO: use StateDef ???


export interface ComponentDefinition {

  // TODO: add others component parameters

  name: string
  // props which are controlled by outer component
  props: Record<string, PropDefinition>
  // local state
  state: Record<string, StateDefinition>
  tmpl?: UiElementDefinition[]
  tmplExp?: string
}


export class Component {
  // componentId
  readonly id: string
  // id of UI element which is represents this component
  readonly uiElId: string
  // undefined means root
  readonly parent?: Component
  // like {componentId: Component}
  readonly children: Record<string, Component> = {}
  // props set in template of parent component
  readonly props: UiProps

  private readonly main: Main
  // initial component definition with its children
  private readonly componentDefinition: ComponentDefinition
  private incomeEventListenerIndex?: number
  // position of UI children elements. Like [componentId, ...]
  private uiChildrenPositions: string[] = []
  private state: UiState


  /**
   * component name. The same as in template and component definition
   */
  get name(): string {
    return this.componentDefinition.name
  }


  constructor(
    main: Main,
    parent: Component | undefined,
    componentDefinition: ComponentDefinition,
    propsValues?: Record<string, any>
  ) {
    this.id = makeUniqId(COMPONENT_ID_BYTES_NUM)
    this.uiElId = makeUniqId(ELEMENT_ID_BYTES_NUM)
    this.main = main
    this.parent = parent
    this.componentDefinition = componentDefinition
    this.props = new UiProps(componentDefinition.props || {}, propsValues)
    this.state = new UiState(componentDefinition.state || {})
  }


  async init() {
    await this.instantiateChildren()

    // TODO: run onInit callback

    // init all the children components
    for (const componentId of Object.keys(this.children)) {
      await this.children[componentId].init()
    }
  }

  async destroy() {
    this.main.incomeEvents.removeListener(this.incomeEventListenerIndex)
    this.props.destroy()
    this.state.destroy()

    for (const componentId of Object.keys(this.children)) {
      await this.children[componentId].destroy()
    }
  }


  /**
   * Get position of child by its UI el id.
   * -1 means - can't find child
   */
  getPositionOfChildrenEl(childrenElId: string): number {
    return this.uiChildrenPositions.indexOf(childrenElId)
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

    this.main.outcomeEvents.emit(OutcomeEvents.mount, this.render())
  }

  /**
   * Unmount rendered elements and it's children and stop listening incoming events.
   * But the component won't be destroyed
   */
  async unmount() {
    // stop listening income events
    this.main.incomeEvents.removeListener(this.incomeEventListenerIndex)

    // TODO: запустить unmount на потомках чтобы они описались от событий
    //       но при этом не нужно уже вызывать из emit unMount event
    // TODO: run onUnmount callback

    this.main.outcomeEvents.emit(OutcomeEvents.unMount, this.makeRenderedEl())
  }

  async update() {
    // TODO: run onUpdate callback

    this.main.outcomeEvents.emit(OutcomeEvents.update, this.renderSelf())
  }

  /**
   * Make render element only for itself without children
   */
  renderSelf(): RenderedElement {
    return {
      ...this.makeRenderedEl(),
      params: this.getUiParams(),
    }
  }

  /**
   * Make full render element with children
   */
  render(): RenderedElement {
    return {
      ...this.renderSelf(),
      children: this.getChildrenUiEls(),
    }
  }


  private handleIncomeEvent = (event: IncomeEvents, elementId: string, ...data: any[]) => {
    switch (event) {
      case IncomeEvents.click:

        console.log(11111, 'click', elementId, ...data)

        // TODO: what to do ???

        break;
    }
  }

  // TODO: review
  private async instantiateChildren() {
    if (this.componentDefinition.tmplExp) {

      // TODO: выполнить выражение

      console.log(22222, 'ext', this.componentDefinition.tmplExp)

      return
    }
    else if (this.componentDefinition.tmpl) {
      const children: UiElementDefinition[] = this.componentDefinition.tmpl

      for (const child of children) {
        const definition = await this.main.componentPool
          .getComponentDefinition(child.component)
        const childComponent = new Component(
          this.main,
          this,
          definition,
          omitObj(child, 'component')
        )

        this.children[childComponent.id] = childComponent
        // set initial position
        this.uiChildrenPositions.push(childComponent.id)
      }
    }
  }

  private makeRenderedEl(): RenderedElement {
    return {
      elId: this.uiElId,
      elName: this.name,
      parentElId: this.parent?.uiElId,
      parentChildPosition: this.parent?.getPositionOfChildrenEl(this.uiElId),
      componentId: this.id,
    }
  }

  private getChildrenUiEls(): RenderedElement[] | undefined {
    const res: RenderedElement[] = []

    for (const childComponentId of this.uiChildrenPositions) {
      res.push(this.children[childComponentId].render())
    }

    if (!res.length) return

    return res
  }

  private getUiParams(): Record<string, any> | undefined {
    // TODO: нужно получить унифицированные параметры для элемента ????
    // TODO: или это props просто? но не всё а только то что нужно для рендера
    return
  }

}
