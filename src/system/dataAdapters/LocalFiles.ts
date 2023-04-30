import yaml from 'yaml'
import axios, {AxiosProgressEvent, AxiosResponse} from 'axios';
import {pathJoin} from 'squidlet-lib';
import {DataAdapterBase} from '../DataAdapterBase.js';
import {makeItemStore} from '../makeItemStore.js';
import {ItemStore} from '../../types/ItemStore.js';
import {ListStore} from '../../types/ListStore.js';
import {makeListStore} from '../makeListStore.js';


interface LocalFilesConfig {
  basePath?: string
  // like http://localhost:3099
  baseUrl: string
}

const DEFAULT_CONFIG = {
  baseUrl: `http://localhost:3099`
}

enum UpdateEvent {
  fileCreated,
  fileUpdated,
  fileRemoved,
  dirUpdated,
  dirRemoved,
}

type UpdateHandler = (action: UpdateEvent, pathTo: string) => void


/**
 * This is singleton adapter which is only one for runtime
 */
class LocalFilesAdapterSingleton extends DataAdapterBase<UpdateHandler> {
  get config(): LocalFilesConfig {
    return this.cfg as LocalFilesConfig
  }


  init(config: Partial<LocalFilesConfig>) {
    super.init({ ...DEFAULT_CONFIG, config })

    if (this.isInitialized) return

    // TODO: слушать обновления с сервера
  }


  async makeRequest<T = any>(urlPath: string): Promise<AxiosResponse<T>> {
    const url = `${this.config.baseUrl}/${urlPath}`

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

  makeFullFilePath(paramPath: string): string {
    if (this.config?.basePath) {
      return pathJoin(this.config.basePath, paramPath)
    }

    return paramPath
  }

}


const adapter = new LocalFilesAdapterSingleton()


/**
 * This is per component instance
 */
export class LocalFiles {


  constructor(config: LocalFilesConfig) {
    adapter.init(config)
  }

  onInitStore() {

  }

  dirContent(params: {path: string}): ListStore {
    const fullFilePath = adapter.makeFullFilePath(params.path)
    let updateHandlerIndex: number = -1
    let listStore: ListStore
    const trueStore = adapter.registerOrGetStore(
      fullFilePath,
      () => {
        const startListener = () => {
          updateHandlerIndex = adapter.updateEvent.addListener(
            (action: UpdateEvent, pathTo: string) => {
              // TODO: проверить что правильные пути относительно корня
              if (fullFilePath !== pathTo) return

              if (action === UpdateEvent.dirUpdated) {
                listStore.$$setValue(newData, false, false, newData.length)
              }
              else if (action === UpdateEvent.dirRemoved) {
                listStore.$$setRemoved(true)
              }
            }
          )
        }
        // make request at first time
        adapter.makeRequest<{result: string[]}>(`load-dir?path=${encodeURIComponent(params.path)}`)
          .then((response) => {
            const result = response.data.result

            listStore.$$setValue(result, false, false, result.length)
          })
          .catch(this.handleRequestError)
          .finally(startListener)
      },
      () => {
        adapter.updateEvent.removeListener(updateHandlerIndex)
      }
    )
    listStore = makeListStore(trueStore, [])

    return listStore
  }

  dataFile(params: {path: string}): ItemStore {
    const fullFilePath = adapter.makeFullFilePath(params.path)
    let updateHandlerIndex: number = -1
    let itemStore: ItemStore
    const trueStore = adapter.registerOrGetStore(
      fullFilePath,
      () => {
        const startListener = () => {
          updateHandlerIndex = adapter.updateEvent.addListener(
            (action: UpdateEvent, pathTo: string) => {
              // TODO: проверить что правильные пути относительно корня
              if (fullFilePath !== pathTo) return

              if (action === UpdateEvent.fileUpdated) {
                itemStore.$$setValue(newData)
              }
              else if (action === UpdateEvent.fileRemoved) {
                itemStore.$$setRemoved(true)
              }
            }
          )
        }
        // make request at first time
        adapter.makeRequest<{result: string}>(`load-file?path=${encodeURIComponent(params.path)}`)
          .then((response) => {
            const dataObj = yaml.parse(response.data.result)

            itemStore.$$setValue(dataObj)
          })
          .catch(this.handleRequestError)
          .finally(startListener)
      },
      () => {
        adapter.updateEvent.removeListener(updateHandlerIndex)
      }
    )
    itemStore = makeItemStore(trueStore, null)

    return itemStore
  }


  private handleRequestError = (e: Error) => {
    console.log(e)

    // TODO: handle error
  }

}
