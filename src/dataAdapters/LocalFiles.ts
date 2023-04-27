import {DataAdapterBase} from '../helpers/DataAdapterBase.js';
import {DataStore} from '../helpers/DataStore.js';


export class LocalFiles extends DataAdapterBase {
  constructor() {
    super()
  }

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
