import {makeTrueStore, TrueStore} from './makeTrueStore.js';
import {AnyHandler, IndexedEvents} from 'squidlet-lib'


export class DataAdapterBase<UpdateHandler extends AnyHandler> {
  updateEvent = new IndexedEvents<UpdateHandler>()

  protected cfg?: Record<string, any>
  private initialized: boolean = false
  private stores: Record<string, TrueStore> = {}

  get isInitialized(): boolean {
    return this.initialized
  }

  get config(): Record<string, any> | undefined {
    return this.cfg
  }


  init(cfg?: Record<string, any>) {
    this.initialized = true
    this.cfg = cfg
  }


  /**
   * Register new store if there isn't any registered.
   * If it is already registered then just return it
   * @param storeId - has to be some unique id like file path
   * @param onInit - start listening for updates here
   * @param onDestroy - stop listening of updates
   */
  registerOrGetStore(
    storeId: string,
    onInit: () => void,
    onDestroy: () => void
  ): TrueStore {
    // if store exists just return it
    if (this.stores[storeId]) return this.stores[storeId]
    // else means a new store
    this.stores[storeId] = makeTrueStore()

    this.stores[storeId].$$onStoreInstancesChange(() => {
      // TODO: если не осталось инстансов то запустить дестрой с задержкой
      onDestroy()
      this.stores[storeId].$$destroyStore()
    })

    onInit()

    return this.stores[storeId]
  }

}
