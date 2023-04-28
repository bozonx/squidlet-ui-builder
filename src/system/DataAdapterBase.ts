import {Readable} from 'svelte/store';
import {ItemStore} from '../types/ItemStore.js';
import {ListStore} from '../types/ListStore.js';


export class DataAdapterBase<Config = Record<string, any>> {
  protected config: Config


  constructor(config: Config) {
    this.config = config
  }


  protected makeInstanceId(): string {
    // TODO: make it
    return '0'
  }

  protected registerInstance(instanceId: string, dataStore: ItemStore | ListStore) {

  }

  protected destroyInstance(instanceId: string) {

  }

}
