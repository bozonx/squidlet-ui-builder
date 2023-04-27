import {DataStore} from './DataStore.js';

export class DataAdapterBase {
  constructor() {
  }


  protected makeInstanceId(): string {
    // TODO: make it
    return '0'
  }

  protected registerInstance(instanceId: string, dataStore: DataStore) {

  }

  protected destroyInstance(instanceId: string) {

  }

}
