import {IndexedEvents, IndexedEventEmitter, ConsoleLogger, Logger} from 'squidlet-lib'
import {OutcomeEvents, IncomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {ROOT_COMPONENT_ID, RootComponent} from './RootComponent.js';
import {ComponentDefinition} from './Component.js';
import {AppSingleton} from './AppSingleton.js';
import {AbstractUiPackage} from './interfaces/types.js';
import {PackageManager} from './PackageManager.js';
import {ComponentsManager} from './ComponentsManager.js';


type OutcomeEventHandler = (event: OutcomeEvents, el: RenderedElement) => void


export const COMPONENT_EVENT_PREFIX = 'C|'

export enum APP_EVENTS {
  initStarted,
  initFinished,
  destroyStarted,
}


export class Main {
  readonly outcomeEvents = new IndexedEvents<OutcomeEventHandler>()
  readonly incomeEvents = new IndexedEventEmitter()
  readonly appEvents = new IndexedEventEmitter()
  log: Logger
  readonly componentsManager = new ComponentsManager(this)
  // TODO: почему это не в AppSingleton ???
  readonly root: RootComponent
  readonly app = new AppSingleton(this)
  private readonly packageManager = new PackageManager(this)


  constructor(preloadedComponentsDefinitions: Record<string, ComponentDefinition>) {
    // TODO: какой logLevel передавать??? дебаг ставить если в конфиге дебаг
    this.log = new ConsoleLogger('info')

    this.componentsManager.registerCompDefinitions(preloadedComponentsDefinitions)
    this.root = new RootComponent(this, this.componentsManager.getDefinition(ROOT_COMPONENT_ID))
  }

  async init() {
    this.appEvents.emit(APP_EVENTS.initStarted)

    await this.root.init()
    // render root component
    await this.root.mount()

    this.appEvents.emit(APP_EVENTS.initFinished)
  }

  async destroy() {
    this.appEvents.emit(APP_EVENTS.destroyStarted)

    this.outcomeEvents.destroy()
    this.incomeEvents.destroy()
    this.appEvents.destroy()
    await this.root.unmount()
    await this.root.destroy()
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
    // TODO: add
  }

  setLogger(logger: Logger) {
    this.log = logger
  }

  use(pkg: AbstractUiPackage) {
    this.packageManager.use(pkg)
  }

}
