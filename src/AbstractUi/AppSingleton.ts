import {IndexedEventEmitter, IndexedEvents} from 'squidlet-lib'
import {Main} from './Main.js';
import {RootComponent} from './RootComponent.js';
import {IncomeEvents, OutcomeEvents} from './types/DomEvents.js';
import {RenderedElement} from './types/RenderedElement.js';


type OutcomeEventHandler = (event: OutcomeEvents, el: RenderedElement) => void


export const COMPONENT_EVENT_PREFIX = 'C|'


export class AppSingleton {
  readonly outcomeEvents = new IndexedEvents<OutcomeEventHandler>()
  readonly incomeEvents = new IndexedEventEmitter()
  readonly root: RootComponent
  private readonly main: Main


  // TODO: сделать по нормальному
  router = {
    toPath: (p: Record<any, any>) => {
      console.log(777, p)
    }
  }


  constructor(main: Main) {
    this.main = main
    this.root = new RootComponent(this.main)
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

}
