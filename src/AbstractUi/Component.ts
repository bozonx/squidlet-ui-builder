import {omitObj, makeUniqId} from 'squidlet-lib';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {COMPONENT_EVENT_PREFIX, Main} from './Main.js';
import {IncomeEvents} from './interfaces/DomEvents.js';


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
  readonly id: string
  readonly children: Component[] = []
  readonly props: Record<string, ComponentProp>

  private readonly main: Main
  // initial component definition
  private readonly componentDefinition: ComponentDefinition
  private incomeEventListenerIndex?: number


  constructor(
    main: Main,
    componentDefinition: ComponentDefinition,
    props: Record<string, ComponentProp> = {}
  ) {
    // TODO: указать количество символом
    this.id = makeUniqId()
    this.main = main
    this.componentDefinition = componentDefinition
    this.props = props
  }


  async init() {
    this.incomeEventListenerIndex = this.main.incomeEvents.addListener(
      COMPONENT_EVENT_PREFIX + this.id,
      this.handleIncomeEvent
    )

    // TODO: run on init event

    await this.instantiateChildren()
    // init all the component
    for (const component of this.children) {
      await component.init()
    }
  }

  async destroy() {
    this.main.incomeEvents.removeListener(this.incomeEventListenerIndex)

    for (const component of this.children) {
      await component.destroy()
    }
  }


  async mount(rootElId: string, childPosition: number) {
    // TODO: run onMount event
    // TODO: mount
    // TODO: наверное надо поднять событие монтирования

    // TODO: resurse пройтись по потомкам и запросить у них tmpl.
    // TODO: но если они уже примонтированны и у них нет изменений то не рендерить их

    const el = {

    }

    this.main.outcomeEvents.emit(OutcomeEvents.mount, el)
  }

  async unmount() {
    // TODO: run onUnmount event
    // TODO: unmount
  }

  async update() {

  }


  private handleIncomeEvent = (event: IncomeEvents, elementId: string, ...data: any[]) => {
    switch (event) {
      case IncomeEvents.click:

        console.log(11111, 'click')

        // TODO: what to do ???

        break;
    }
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

        this.children.push(
          new Component(this.main, definition, omitObj(child, 'component'))
        )
      }
    }
  }

}
