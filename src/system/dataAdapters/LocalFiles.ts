import yaml from 'yaml'
import axios, {AxiosProgressEvent, AxiosResponse} from 'axios';
import {IndexedEvents, pathJoin} from 'squidlet-lib';
import {DataAdapterBase} from '../DataAdapterBase.js';
import {makeItemStore} from '../makeItemStore.js';
import {ItemStore} from '../../types/ItemStore.js';
import {ListStore} from '../../types/ListStore.js';
import {makeListStore} from '../makeListStore.js';


interface LocalFilesConfig {
  basePath: string
}

enum UpdateEvent {
  fileCreated,
  fileUpdated,
  fileRemoved,
  dirUpdated,
  dirRemoved,
}
type CreatedFileHandler = (action: UpdateEvent.fileCreated, pathTo: string, newData: string) => void
type UpdatedFileHandler = (action: UpdateEvent.fileUpdated, pathTo: string, newData: string) => void
type RemovedFileHandler = (action: UpdateEvent.fileRemoved, pathTo: string) => void
type UpdatedDirHandler = (action: UpdateEvent.dirUpdated, pathTo: string, newData: string []) => void
type RemovedDirHandler = (action: UpdateEvent.dirUpdated, pathTo: string) => void
type UpdateHandler = CreatedFileHandler | UpdatedFileHandler | RemovedFileHandler | UpdatedDirHandler | RemovedDirHandler


export class LocalFiles extends DataAdapterBase<LocalFilesConfig> {
  updateEvent = new IndexedEvents<UpdateHandler>()


  constructor(config: LocalFilesConfig) {
    super(config)
  }

  // TODO: запустить инит
  // TODO: при этом экземпляр Local files должен быть один
  // TODO: слушать обновления с сервера
  async init() {

  }

  dirContent(params: {path: string}): ListStore {
    const fullFilePath = this.makeFullFilePath(params.path)
    let updateHandlerIndex: number = -1
    let listStore: ListStore
    const trueStore = this.registerOrGetStore(
      fullFilePath,
      () => {
        const startListener = () => {
          updateHandlerIndex = this.updateEvent.addListener(
            (action: UpdateEvent, pathTo: string, newData: string[]) => {
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
        this.makeRequest<{result: string[]}>(`load-dir?path=${encodeURIComponent(params.path)}`)
          .then((response) => {
            const result = response.data.result

            listStore.$$setValue(result, false, false, result.length)
            startListener()
          })
          .catch((e) => {
            this.handleRequestError(e)
            startListener()
          })
      },
      () => {
        this.updateEvent.removeListener(updateHandlerIndex)
      }
    )
    listStore = makeListStore(trueStore, [])

    return listStore
  }

  dataFile(params: {path: string}): ItemStore {
    const fullFilePath = this.makeFullFilePath(params.path)
    let updateHandlerIndex: number = -1
    let itemStore: ItemStore
    const trueStore = this.registerOrGetStore(
      fullFilePath,
      () => {
        const startListener = () => {
          updateHandlerIndex = this.updateEvent.addListener(
            (action: UpdateEvent, pathTo: string, newData: string) => {
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
        this.makeRequest<{result: string}>(`load-file?path=${encodeURIComponent(params.path)}`)
          .then((response) => {
            const dataObj = yaml.parse(response.data.result)

            itemStore.$$setValue(dataObj)
            startListener()
          })
          .catch((e) => {
            this.handleRequestError(e)
            startListener()
          })
      },
      () => {
        this.updateEvent.removeListener(updateHandlerIndex)
      }
    )
    itemStore = makeItemStore(trueStore, null)

    return itemStore
  }


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
