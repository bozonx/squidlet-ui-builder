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
  readonly root: RootComponent
  // like: {pathToComponent: ComponentDefinition}
  private readonly appComponentsDefinitions: Record<string, ComponentDefinition>
  // like: {componentName: ComponentDefinition}
  private readonly componentsLib: Record<string, ComponentDefinition> = {}


  constructor(
    preloadedComponentsDefinitions: Record<string, ComponentDefinition>,
    // like: {libName: {componentName: ComponentDefinitionString}}
    componentsLibsStr: Record<string, Record<string, string>> = {}
  ) {
    this.appComponentsDefinitions = preloadedComponentsDefinitions

    const libs: Record<string, Record<string, string>> = {
      std: STD_COMPONENTS,
      ...componentsLibsStr
    }

    for (const libName of Object.keys(libs)) {
      for (const cmpName of Object.keys(libs[libName])) {
        this.componentsLib[cmpName] = yaml.parse(STD_COMPONENTS[cmpName])
      }
    }

    this.root = new RootComponent(this, this.appComponentsDefinitions[ROOT_COMPONENT_ID])
  }

  async init() {
    await this.root.init()
    // render root component
    await this.root.mount()
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
    else if (this.componentsLib[pathOrStdComponentName]) {
      return this.componentsLib[pathOrStdComponentName]
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
