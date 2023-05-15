import yaml from 'yaml';
import {IndexedEvents, IndexedEventEmitter} from 'squidlet-lib'
import {ComponentsPool} from './ComponentsPool.js';
import {OutcomeEvents, IncomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {RootComponent} from './RootComponent.js';
import {ComponentDefinition} from './ComponentBase.js';


type OutcomeEventHandler = (event: OutcomeEvents, el: RenderedElement) => void


export const COMPONENT_EVENT_PREFIX = 'C|'


export class Main {
  readonly outcomeEvents = new IndexedEvents<OutcomeEventHandler>()
  readonly incomeEvents = new IndexedEventEmitter()
  componentPool: ComponentsPool
  root: RootComponent


  constructor(rootComponentDefinitionStr: string) {
    this.componentPool = new ComponentsPool()

    const rootComponentDefinition: ComponentDefinition = yaml.parse(rootComponentDefinitionStr)

    this.root = new RootComponent(this, rootComponentDefinition)
  }

  async init() {
    await this.root.init()
  }

  async destroy() {
    this.outcomeEvents.destroy()
    this.incomeEvents.destroy()
    await this.root.destroy()
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
