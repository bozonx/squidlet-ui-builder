import {omitObj} from 'squidlet-lib';
import {UiElementDefinition} from './interfaces/UiElementDefinitionBase.js';
import {COMPONENT_EVENT_PREFIX, Main} from './Main.js';
import {IncomeEvents, OutcomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {Component} from './Component.js';
import {RootComponent} from './RootComponent.js';


// TODO: поддержка перемещения элементов
// TODO: add slot !!!
// TODO: add props
// TODO: add state


export interface ComponentDefinition {

  // TODO: add others component parameters

  name: string
  // props which are controlled by parent component
  props?: Record<string, PropDefinition>
  // local state
  state?: Record<string, StateDefinition>
  tmpl?: UiElementDefinition[]
}



export abstract class ComponentBase {
  readonly abstract isRoot: boolean
  // componentId
  readonly abstract id: string
  // id of UI element which is represents this component
  readonly abstract uiElId: string
  // like {componentId: Component}
  readonly children: Record<string, Component> = {}

  protected readonly main: Main
  // initial component definition with its children
  protected readonly componentDefinition: ComponentDefinition
  // position of UI children stdLib. Like [componentId, ...]
  protected uiChildrenPositions: string[] = []
  protected state: UiState
  private incomeEventListenerIndex?: number
  // They set in parent template
  // TODO: тут должен быть Super Prop - так как они будут управляться из вне
  // props set in template of parent component
  readonly props: UiProps


  /**
   * component name. The same as in template and component definition
   */
  get name(): string {
    return this.componentDefinition.name
  }


  protected constructor(main: Main, componentDefinition: ComponentDefinition, propsValues?: Record<string, any>) {
    this.main = main
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
   * Mount rendered stdLib and it's children and start listening income events
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
   * Unmount rendered stdLib and it's children and stop listening incoming events.
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

  private async instantiateChildren() {
    if (!this.componentDefinition.tmpl) return

    for (const child of this.componentDefinition.tmpl) {
      const definition = await this.main.getComponentDefinition(child.component)
      const childComponent = new Component(
        this.main,
        this as Component | RootComponent,
        definition,
        omitObj(child, 'component')
      )

      this.children[childComponent.id] = childComponent
      // set initial position
      this.uiChildrenPositions.push(childComponent.id)
    }
  }

  private makeRenderedEl(): RenderedElement {
    const params = {
      elId: this.uiElId,
      elName: this.name,
      componentId: this.id,
    }

    if (this.isRoot) {
      return {
        ...params,
        parentElId: '',
        parentChildPosition: -1,
      }
    }
    else {
      // not root means it is Component
      const cmp: Component = this as any

      return {
        ...params,
        parentElId: cmp.parent.uiElId,
        parentChildPosition: cmp.parent.getPositionOfChildrenEl(this.uiElId),
      }
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
