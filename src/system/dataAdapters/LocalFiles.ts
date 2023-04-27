import {DataAdapterBase} from '../DataAdapterBase.js';
import {DataStore} from '../DataStore.js';


interface LocalFilesConfig {

}


export class LocalFiles extends DataAdapterBase<LocalFilesConfig> {
  constructor(config: LocalFilesConfig) {
    super(config)
  }

  // TODO: должен регистрировать все стейты

  dataFile(params: {filePath: string}): DataStore {
    const instanceId = this.makeInstanceId()
    const destroyFn = async () => this.destroyInstance(instanceId)
    const dataStore = new DataStore(destroyFn)

    this.registerInstance(instanceId, dataStore)

    // TODO: load file
    // TODO: put file data to dataStore
    // TODO: listen file updates and update value of dataStore

    return dataStore
  }

}
