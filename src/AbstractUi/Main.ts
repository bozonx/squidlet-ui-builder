import yaml from 'yaml';
import {IndexedEvents} from 'squidlet-lib'
import {ComponentsPool} from './ComponentsPool.js';
import {Component, ComponentDefinition} from './Component.js';
import {UiElementDefinition} from './interfaces/UiElementDefinitionBase.js';
import {OutcomeEvents, IncomeEvents} from './interfaces/DomEvents.js';


type OutcomeEventHandler = (event: OutcomeEvents, rootElId: string, childPosition: number, tmpl?: UiElementDefinition) => void
type IncomeEventHandler = (
  event: IncomeEvents,
  componentId: string,
  elementId: string,
  ...data: any[]
) => void


export class Main {
  readonly outcomeEvents = new IndexedEvents<OutcomeEventHandler>()
  readonly incomeEvents = new IndexedEvents<IncomeEventHandler>()
  componentPool: ComponentsPool
  rootComponent: Component


  constructor(rootComponentDefinitionStr: string) {
    this.componentPool = new ComponentsPool()

    const rootComponentDefinition: ComponentDefinition = yaml.parse(rootComponentDefinitionStr)

    this.rootComponent = new Component(this, rootComponentDefinition)

    //this.incomeEvents.addListener(this.handleIncomeEvent)
  }

  async init() {
    await this.rootComponent.init()
    // render root component
    await this.rootComponent.mount('/', 0)
  }

  async destroy() {
    // TODO: послать событие на unmount корня
    // TODO: дестрой всех компонентов

    this.outcomeEvents.destroy()
    this.incomeEvents.destroy()
  }


  emitMount(rootElId: string, childPosition: number, tmpl: UiElementDefinition) {
    this.outcomeEvents.emit(OutcomeEvents.mount, rootElId, childPosition, tmpl)
  }

  emitUnmount(rootElId: string, childPosition: number) {
    this.outcomeEvents.emit(OutcomeEvents.unMount, rootElId, childPosition)
  }

  emitUpdate(rootElId: string, childPosition: number, tmpl: UiElementDefinition) {
    this.outcomeEvents.emit(OutcomeEvents.update, rootElId, childPosition, tmpl)
  }

  /**
   * Call it from outside code
   */
  emitIncomeEvent(event: IncomeEvents, elementId: string, ...data: any[]) {
    this.incomeEvents.emit(event, elementId, ...data)
  }


  // private handleIncomeEvent = (event: IncomeEvents, elementId: string, ...data: any[]) => {
  // }

}
