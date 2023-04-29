import yaml from 'yaml'
import axios, {AxiosProgressEvent, AxiosResponse} from 'axios';
import {DataAdapterBase} from '../DataAdapterBase.js';
import {makeItemStore} from '../makeItemStore.js';
import {ItemStore} from '../../types/ItemStore.js';
import {ListStore} from '../../types/ListStore.js';
import {makeListStore} from '../makeListStore.js';


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
    const dataStore: ListStore = makeListStore([])

    this.registerInstance(instanceId, dataStore)
    this.makeRequest<{result: string[]}>(`load-dir?path=${encodeURIComponent(params.path)}`)
      .then((response) => dataStore.$$setValue(response.data.result))
      .catch(this.handleRequestError)

    // TODO: listen file updates and update value of dataStore

    return dataStore
  }

  dataFile(params: {path: string}): ItemStore {
    const instanceId = this.makeInstanceId()
    // TODO: use destroy
    const destroyFn = async () => this.destroyInstance(instanceId)
    const dataStore: ItemStore = makeItemStore(null)

    this.registerInstance(instanceId, dataStore)
    this.makeRequest<{result: string}>(`load-file?path=${encodeURIComponent(params.path)}`)
      .then((response) => {
        const dataObj = yaml.parse(response.data.result)

        dataStore.$$setValue(dataObj)
      })
      .catch(this.handleRequestError)

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

  private async makeRequest<T = any>(urlPath: string): Promise<AxiosResponse<T>> {
    const url = `${this.makeBaseUrl()}/${urlPath}`

    return axios({
      url,
      method: 'GET',
      responseType: 'json',
      responseEncoding: 'utf8',
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        // TODO: add
      },
    })
  }

  private handleRequestError = (e: Error) => {
    console.log(e)

    // TODO: handle error
  }

}
