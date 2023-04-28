import yaml from 'yaml'
import axios from 'axios';
import {DataAdapterBase} from '../DataAdapterBase.js';
import {makeItemStore} from '../makeItemStore.js';
import {ItemStore} from '../../types/ItemStore.js';
import {ListStore} from '../../types/ListStore.js';


// TODO: не используется
interface LocalFilesConfig {
  basePath: string
}


export class LocalFiles extends DataAdapterBase<LocalFilesConfig> {
  constructor(config: LocalFilesConfig) {
    super(config)
  }


  dirContent(params: {path: string}): ListStore {
    const instanceId = this.makeInstanceId()
    // TODO: use destroy
    const destroyFn = async () => this.destroyInstance(instanceId)
    const dataStore: ItemStore = makeItemStore(null)

    this.registerInstance(instanceId, dataStore)

    // TODO: use params.filePath

    axios({
      url: `${this.makeBaseUrl()}/load-file?path=${encodeURIComponent('screens/Home.yaml')}`
    })
      .then((response) => {
        const yamlContent: string = response.data.result
        const dataObj = yaml.parse(yamlContent)

        dataStore.$$setValue(dataObj)
      })
      .catch((e) => {
        // TODO: what to do on error???

        console.error(e)
      })

    // TODO: load file
    // TODO: put file data to dataStore
    // TODO: listen file updates and update value of dataStore

    return dataStore
  }

  dataFile(params: {path: string}): ItemStore {
    const instanceId = this.makeInstanceId()
    // TODO: use destroy
    const destroyFn = async () => this.destroyInstance(instanceId)
    const dataStore: ItemStore = makeItemStore(null)

    this.registerInstance(instanceId, dataStore)

    // TODO: use params.filePath

    axios({
      url: `${this.makeBaseUrl()}/load-file?path=${encodeURIComponent('screens/Home.yaml')}`
    })
      .then((response) => {
        const yamlContent: string = response.data.result
        const dataObj = yaml.parse(yamlContent)

        dataStore.$$setValue(dataObj)
      })
      .catch((e) => {
        // TODO: what to do on error???

        console.error(e)
      })

    // TODO: load file
    // TODO: put file data to dataStore
    // TODO: listen file updates and update value of dataStore

    return dataStore
  }

  // dirContent(params: {path: string}): ListStore {
  //   const dataStore: ListStore = makeListStore([])
  //
  //   this.registerInstance(instanceId, dataStore)
  //
  //   return dataStore
  // }


  private makeBaseUrl(): string {
    // TODO: взять из параметров
    return `http://localhost:3099`
  }

}
