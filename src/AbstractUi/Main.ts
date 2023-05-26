import yaml from 'yaml';
import {IndexedEvents, IndexedEventEmitter, ConsoleLogger, Logger} from 'squidlet-lib'
import {OutcomeEvents, IncomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {ROOT_COMPONENT_ID, RootComponent} from './RootComponent.js';
import {ComponentDefinition} from './Component.js';
import {STD_COMPONENTS} from './stdLib/index.js';
import {AppSingleton} from './AppSingleton.js';
import {AbstractUiPackage} from './interfaces/types.js';
import {PackageManager} from './PackageManager.js';


type OutcomeEventHandler = (event: OutcomeEvents, el: RenderedElement) => void


export const COMPONENT_EVENT_PREFIX = 'C|'


export class Main {
  readonly outcomeEvents = new IndexedEvents<OutcomeEventHandler>()
  readonly incomeEvents = new IndexedEventEmitter()
  readonly root: RootComponent
  readonly app = new AppSingleton(this)
  log: Logger
  // like: {pathToComponent: ComponentDefinition}
  private readonly appComponentsDefinitions: Record<string, ComponentDefinition>
  // like: {componentName: ComponentDefinition}
  private readonly componentsLib: Record<string, ComponentDefinition> = {}
  private readonly packageManager = new PackageManager(this)


  constructor(
    preloadedComponentsDefinitions: Record<string, ComponentDefinition>,
  ) {
    // TODO: какой logLevel передавать??? дебаг ставить если в конфиге дебаг
    this.log = new ConsoleLogger('info')
    this.appComponentsDefinitions = preloadedComponentsDefinitions
    // TODO: почему это не в AppSingleton ???
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
    await this.root.unmount()
    await this.root.destroy()
  }


  getComponentDefinition(pathOrStdComponentName: string): ComponentDefinition {

    //console.log(111, 'requested cmp - ', pathOrStdComponentName)

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
  emitIncomeEvent(event: IncomeEvents, componentId: string, ...data: any[]) {
    // emit ordinary event
    this.incomeEvents.emit(event, componentId, ...data)
    // emit component specific event
    this.incomeEvents.emit(COMPONENT_EVENT_PREFIX + componentId, event, ...data)
  }

  setRouter() {

  }

  setLogger(logger: Logger) {
    this.log = logger
  }

  registerComponentsLib(libName: string) {

  }

  use(pkg: AbstractUiPackage) {
    this.packageManager.use(pkg)
  }

}
