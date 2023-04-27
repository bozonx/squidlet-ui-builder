import {DataAdapterBase} from '../helpers/DataAdapterBase.js';
import {DataStore} from '../helpers/DataStore.js';


export class LocalFiles extends DataAdapterBase {
  constructor() {
    super()
  }

  async dataFile(params: {filePath: string}): Promise<DataStore> {
    const dataStore = new DataStore()

    // TODO: load file
    // TODO: put file data to dataStore

    return dataStore
  }


}
