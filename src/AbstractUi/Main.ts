import yaml from 'yaml';
import {IndexedEvents, IndexedEventEmitter} from 'squidlet-lib'
import {OutcomeEvents, IncomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {ROOT_COMPONENT_ID, RootComponent} from './RootComponent.js';
import {ComponentDefinition} from './ComponentBase.js';
import {STD_COMPONENTS} from './stdLib/index.js';


type OutcomeEventHandler = (event: OutcomeEvents, el: RenderedElement) => void


export const COMPONENT_EVENT_PREFIX = 'C|'


export class Main {
  readonly outcomeEvents = new IndexedEvents<OutcomeEventHandler>()
  readonly incomeEvents = new IndexedEventEmitter()
  root: RootComponent
  private readonly appComponentsDefinitions: Record<string, ComponentDefinition>
  private readonly stdComponentsDefinitions: Record<string, ComponentDefinition> = {}
  // TODO: add libs of components


  constructor(preloadedComponentsDefinitions: Record<string, ComponentDefinition>) {
    this.appComponentsDefinitions = preloadedComponentsDefinitions

    this.root = new RootComponent(this, this.appComponentsDefinitions[ROOT_COMPONENT_ID])
  }

  async init() {
    for (const cmpName of Object.keys(STD_COMPONENTS)) {
      this.stdComponentsDefinitions[cmpName] = yaml.parse(STD_COMPONENTS[cmpName])
    }

    await this.root.init()
  }

  async destroy() {
    this.outcomeEvents.destroy()
    this.incomeEvents.destroy()
    await this.root.destroy()
  }


  getComponentDefinition(pathOrStdComponentName: string): ComponentDefinition {

    console.log(111, 'requested cmp - ', pathOrStdComponentName)

    if (this.appComponentsDefinitions[pathOrStdComponentName]) {
      return this.appComponentsDefinitions[pathOrStdComponentName]
    }
    else if (this.stdComponentsDefinitions[pathOrStdComponentName]) {
      return this.stdComponentsDefinitions[pathOrStdComponentName]
    }
    else {
      throw new Error(`Can't find component "${pathOrStdComponentName}"`)
    }
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
