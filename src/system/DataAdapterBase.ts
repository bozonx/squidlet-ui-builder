import {Readable} from 'svelte/store';
import {ItemStore} from '../types/ItemStore.js';
import {ListStore} from '../types/ListStore.js';


export class DataAdapterBase<Config = Record<string, any>> {
  protected config: Config
  private stores: Record<string, (ListStore | ItemStore)> = {}


  constructor(config: Config) {
    this.config = config
  }


  protected makeInstanceId(): string {
    // TODO: make it
    return '0'
  }

  /**
   * Register new store in there isn't any registered.
   * If it is already registered then just return it
   * @param storeId - has to be some unique id like file path
   */
  protected registerOrGetStore<T = ItemStore | ListStore>(
    storeId: string,
    instatiate: () => T
  ): T {
    const instanceId = this.makeInstanceId()
    // TODO: use destroy
    const destroyFn = async () => this.destroyInstance(instanceId)

    this.registerInstance(instanceId, dataStore)

    return instatiate()
  }

  protected registerInstance(instanceId: string, dataStore: ItemStore | ListStore) {

  }

  protected destroyInstance(instanceId: string) {

  }

}
