import {ItemStore} from '../types/ItemStore.js';
import {ListStore} from '../types/ListStore.js';
import {TrueStore} from './makeTrueStore.js';


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
    if (this.stores[storeId]) return this.stores[storeId] as T

    // TODO: use destroy

    this.registerInstance(instanceId, dataStore)

    return instatiate()
  }

  protected registerInstance(instanceId: string, dataStore: ItemStore | ListStore) {

  }

}
