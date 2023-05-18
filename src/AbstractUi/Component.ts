import {omitObj, makeUniqId} from 'squidlet-lib';
import {UiElementDefinition} from './interfaces/UiElementDefinitionBase.js';
import {COMPONENT_EVENT_PREFIX, Main} from './Main.js';
import {IncomeEvents, OutcomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {SuperStruct, SuperStructInitDefinition} from '../sprog/superStruct.js';
import {ComponentSlotsManager, SlotsDefinition} from './ComponentSlotsManager.js';
import {COMPONENT_ID_BYTES_NUM} from './interfaces/constants.js';
import {AppSingleton} from './AppSingleton.js';
import {newScope, SuperScope} from '../sprog/scope.js';


// TODO: поддержка перемещения элементов

// TODO: нужен какой-то scope где будет доступ в sprog к props, state
//       и доступ к переменным навешанные на props навешанных на потомков

// TODO: run onUpdate callback of component definition
// TODO: call onMount component's callback of component definition
// TODO: call onUnmount component's callback of component definition


export interface ComponentDefinition {

  // TODO: add others component parameters

  name: string
  // props which are controlled by parent component
  props?: Record<string, SuperStructInitDefinition>
  // local state
  state?: Record<string, SuperStructInitDefinition>
  // names of params which will be sent to UI.
  // they will be got from props and state.
  // to rename or get param from component use [newName, () => { return ... }]
  uiParams?: (string | [string, () => any])[]
  // TODO: add there type of Sprog
  handlers?: Record<string, any>
  tmpl?: UiElementDefinition[]
}

/**
 * Scope for executing sprog
 */
export interface ComponentScope {
  app: AppSingleton
  props: SuperStruct
  state: SuperStruct
  // local vars and context of functions execution
  context: Record<any, any>
}



export class Component {
  readonly isRoot: boolean = false
  // componentId
  readonly id: string

  // TODO: поидее не нужно так как 1 компонент = 1 ui элемент
  // id of UI element which is represents this component
  //readonly abstract uiElId: string

  // like {componentId: Component}
  readonly children: Record<string, Component> = {}
  // if it is root then it will be null
  readonly parent: Component

  protected readonly main: Main
  // initial component definition with its children
  protected readonly componentDefinition: ComponentDefinition
  // position of UI children stdLib. Like [componentId, ...]
  protected uiChildrenPositions: string[] = []
  protected state: SuperStruct
  private incomeEventListenerIndex?: number
  // They set in parent template
  // TODO: тут должен быть Super Prop - так как они будут управляться из вне
  // props set in template of parent component
  readonly props: SuperStruct
  readonly slots: ComponentSlotsManager

  protected readonly scope: ComponentScope & SuperScope


  /**
   * component name. The same as in template and component definition
   */
  get name(): string {
    return this.componentDefinition.name
  }


  protected constructor(
    main: Main,
    parent: Component,
    // definition component itself
    componentDefinition: ComponentDefinition,
    // slots of component which get from parent component template
    slotsDefinition: SlotsDefinition,
    // props which parent give
    incomeProps: SuperStruct
  ) {
    this.main = main
    this.parent = parent
    this.componentDefinition = componentDefinition
    this.props = incomeProps
    this.state = new SuperStruct(componentDefinition.state || {})
    this.slots = new ComponentSlotsManager(slotsDefinition)
    this.id = this.makeId()
    this.scope = newScope<ComponentScope>({
      app: this.main.app,
      props: this.props,
      state: this.state,
      context: {},
    })
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
    await this.slots.destroy()
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
   * Mount this component's element.
   * Actually means emit mount event and listen element's income events.
   * @param silent - means do not emit render event.
   *   It is used only if parent has already rendered. Buy this component need to
   *   listen ui events
   */
  async mount(silent: boolean = false) {
    // start listening income events
    this.incomeEventListenerIndex = this.main.incomeEvents.addListener(
      COMPONENT_EVENT_PREFIX + this.id,
      this.handleIncomeEvent
    )

    if (!silent) {
      this.main.outcomeEvents.emit(OutcomeEvents.mount, this.render())
    }

    for (const childId of Object.keys(this.children)) {
      // mount child always silent
      await this.children[childId].mount(true)
    }
  }

  /**
   * Unmount this component's element.
   * Means stop listenint ui change events and But the component won't be destroyed
   */
  async unmount(silent: boolean = false) {
    // stop listening income events
    this.main.incomeEvents.removeListener(this.incomeEventListenerIndex)

    for (const childId of Object.keys(this.children)) {
      // unmount child always silent
      await this.children[childId].unmount(true)
    }

    if (!silent) {
      this.main.outcomeEvents.emit(OutcomeEvents.unMount, this.makeRenderedEl())
    }
  }

  // async update() {
  //
  //
  //
  //   this.main.outcomeEvents.emit(OutcomeEvents.update, this.renderSelf())
  // }

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

  protected makeId(): string {
    return makeUniqId(COMPONENT_ID_BYTES_NUM)
  }


  private handleIncomeEvent = (event: IncomeEvents, ...args: any[]) => {
    (async () => {
      switch (event) {
        case IncomeEvents.click:
          if (this.componentDefinition?.handlers?.click) {
            const scope = newScope({
              context: {
                args
              }
            }, this.scope)

            await scope.run(this.componentDefinition.handlers.click)
          }

          break
      }
    })()
      // TODO: put to main logger
      .catch(console.error)
  }

  private async instantiateChildren() {
    if (this.componentDefinition.tmpl) {
      for (const child of this.componentDefinition.tmpl) {
        await this.instantiateChild(child)
      }
    }
    else {
      // if component doesn't have tmpl then just render default slot like it is tmpl
      for (const child of this.slots.getDefaultDefinition() || []) {
        await this.instantiateChild(child)
      }
    }
  }

  async instantiateChild(childUiDefinition: UiElementDefinition) {
    const {
      componentDefinition,
      slotDefinition,
      props,
    } = this.prepareChild(childUiDefinition)

    //console.log(1111, childUiDefinition, componentDefinition, slotDefinition, props)

    const childComponent = new Component(
      this.main,
      this,
      componentDefinition,
      slotDefinition,
      props
    )

    this.children[childComponent.id] = childComponent
    // set initial position
    this.uiChildrenPositions.push(childComponent.id)
  }

  private prepareChild(childUiDefinition: UiElementDefinition): {
    componentName: string
    propsValues: Record<string, any>
    slotDefinition: SlotsDefinition
    componentDefinition: ComponentDefinition
    props: SuperStruct
    propSetter: (pathTo: string, newValue: any) => void
  } {
    const componentName: string = childUiDefinition.component
    // values of child props which are set in this (parent) component
    const propsValues: Record<string, any> = omitObj(childUiDefinition, 'component', 'slot')
    const componentDefinition = this.main
      .getComponentDefinition(componentName)
    const props = new SuperStruct(
      // if no props then put just empty props
      componentDefinition.props || {},
      // props are readonly by default
      true
    )
    const propSetter = props.init(propsValues)
    let slotDefinition: SlotsDefinition = {}

    if (Array.isArray(childUiDefinition.slot)) {
      slotDefinition = {
        default: childUiDefinition.slot
      }
    }
    else if (typeof childUiDefinition.slot === 'object') {
      slotDefinition = childUiDefinition.slot
    }

    // TODO: в childPropsValues как примитивы, так и sprog - надо его выполнить наверное
    // TODO: props должен быть связан с текущим компонентом
    // TODO: propSetter надо сохранить себе чтобы потом устанавливать значения

    return {
      componentName,
      propsValues,
      slotDefinition,
      componentDefinition,
      props,
      propSetter,
    }
  }

  private makeRenderedEl(): RenderedElement {
    const baseParams = {
      name: this.name,
      componentId: this.id,
    }

    if (this.isRoot) {
      return {
        ...baseParams,
        parentId: '',
        parentChildPosition: -1,
      }
    }
    else {
      // not root means it is Component. It has to have parent
      const cmpParent: Component = this.parent!

      return {
        ...baseParams,
        parentId: cmpParent.id,
        parentChildPosition: cmpParent.getPositionOfChildrenEl(this.id),
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
    if (!this.componentDefinition.uiParams) return

    const res: Record<string, any> = {}

    for (const item of this.componentDefinition.uiParams) {
      if (typeof item === 'string') {
        if (this.state.has(item)) {
          res[item] = this.state.getValue(item)
        }
        else if (this.props.has(item)) {
          res[item] = this.props.getValue(item)
        }
      }
      else {
        // means [string, () => any]
        res[item[0]] = item[1]()
      }
    }

    if (!Object.keys(res).length) return

    return res
  }

}
