import {makeTrueStore, TrueStore} from './makeTrueStore.js';


export class DataAdapterBase<Config = Record<string, any>> {
  protected config: Config
  private stores: Record<string, TrueStore> = {}


  constructor(config: Config) {
    this.config = config
  }


  /**
   * Register new store in there isn't any registered.
   * If it is already registered then just return it
   * @param storeId - has to be some unique id like file path
   * @param onInit - start listening for updates here
   * @param onDestroy - stop listening of updates
   */
  protected registerOrGetStore(
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
