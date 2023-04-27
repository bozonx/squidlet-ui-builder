import yaml from 'yaml'
import {DataAdapterBase} from '../DataAdapterBase.js';
import {DataStore} from '../DataStore.js';


interface LocalFilesConfig {
  basePath: string
}


const testData = `
children:
  - "000001"
`


export class LocalFiles extends DataAdapterBase<LocalFilesConfig> {
  constructor(config: LocalFilesConfig) {
    super(config)
  }


  dataFile(params: {filePath: string}): DataStore {
    const instanceId = this.makeInstanceId()
    const destroyFn = async () => this.destroyInstance(instanceId)
    const dataStore = new DataStore(destroyFn)

    this.registerInstance(instanceId, dataStore)

    setTimeout(() => {
      const dataObj = yaml.parse(testData)

      dataStore.$$setValue(dataObj)
    }, 1000)

    // TODO: load file
    // TODO: put file data to dataStore
    // TODO: listen file updates and update value of dataStore

    return dataStore
  }

}
