import yaml from 'yaml'
import axios, {AxiosProgressEvent, AxiosResponse} from 'axios';
import {pathJoin} from 'squidlet-lib';
import {DataAdapterBase} from '../DataAdapterBase.js';
import {makeItemStore} from '../makeItemStore.js';
import {ItemStore} from '../../types/ItemStore.js';
import {ListStore} from '../../types/ListStore.js';
import {makeListStore} from '../makeListStore.js';


interface LocalFilesConfig {
  basePath: string
}


export class LocalFiles extends DataAdapterBase<LocalFilesConfig> {
  constructor(config: LocalFilesConfig) {
    super(config)
  }


  dirContent(params: {path: string}): ListStore {
    const storeId = this.makeFullFilePath(params.path)
    const store = this.registerOrGetStore<ListStore>(
      storeId,
      () => makeListStore([])
    )

    this.makeRequest<{result: string[]}>(`load-dir?path=${encodeURIComponent(params.path)}`)
      .then((response) => {
        const result = response.data.result

        store.$$setValue(result, false, false, result.length)
      })
      .catch(this.handleRequestError)

    // TODO: listen file updates and update value of dataStore

    return store
  }

  dataFile(params: {path: string}): ItemStore {
    const storeId = this.makeFullFilePath(params.path)
    const store = this.registerOrGetStore<ItemStore>(
      storeId,
      () => makeItemStore(null)
    )

    this.makeRequest<{result: string}>(`load-file?path=${encodeURIComponent(params.path)}`)
      .then((response) => {
        const dataObj = yaml.parse(response.data.result)

        store.$$setValue(dataObj)
      })
      .catch(this.handleRequestError)

    // TODO: listen file updates and update value of dataStore

    return store
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

  private makeFullFilePath(paramPath: string): string {
    if (this.config?.basePath) {
      return pathJoin(this.config.basePath, paramPath)
    }

    return paramPath
  }

}
