import {DataStore} from './DataStore.js';

export class DataAdapterBase<Config = Record<string, any>> {
  protected config: Config


  constructor(config: Config) {
    this.config = config
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
