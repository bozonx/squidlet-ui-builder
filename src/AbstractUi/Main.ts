import yaml from 'yaml';
import {IndexedEvents, IndexedEventEmitter} from 'squidlet-lib'
import {ComponentsPool} from './ComponentsPool.js';
import {Component, ComponentDefinition} from './Component.js';
import {OutcomeEvents, IncomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';


type OutcomeEventHandler = (event: OutcomeEvents, el: RenderedElement) => void


export const COMPONENT_EVENT_PREFIX = 'C|'


export class Main {
  readonly outcomeEvents = new IndexedEvents<OutcomeEventHandler>()
  readonly incomeEvents = new IndexedEventEmitter()
  componentPool: ComponentsPool
  rootComponent: Component


  constructor(rootComponentDefinitionStr: string) {
    this.componentPool = new ComponentsPool()

    const rootComponentDefinition: ComponentDefinition = yaml.parse(rootComponentDefinitionStr)

    // TODO: создать root component

    this.rootComponent = new Component(this, rootComponentDefinition)
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


  /**
   * Call it from outside code
   */
  emitIncomeEvent(event: IncomeEvents, componentId: string, elementId: string, ...data: any[]) {
    // emit ordinary event
    this.incomeEvents.emit(event, componentId, elementId, ...data)
    // emit component specific event
    this.incomeEvents.emit(COMPONENT_EVENT_PREFIX + componentId, event, elementId, ...data)
  }

}
