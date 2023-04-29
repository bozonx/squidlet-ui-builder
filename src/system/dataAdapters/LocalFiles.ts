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
}
type CreatedFileHandler = (action: UpdateEvent.fileCreated, pathTo: string, newData: string) => void
type UpdatedFileHandler = (action: UpdateEvent.fileUpdated, pathTo: string, newData: string) => void
type RemovedFileHandler = (action: UpdateEvent.fileRemoved, pathTo: string) => void
type UpdatedDirHandler = (action: UpdateEvent.dirUpdated, pathTo: string, newData: string []) => void
type UpdateHandler = CreatedFileHandler | UpdatedFileHandler | RemovedFileHandler | UpdatedDirHandler


export class LocalFiles extends DataAdapterBase<LocalFilesConfig> {
  updateEvent = new IndexedEvents<UpdateHandler>()


  constructor(config: LocalFilesConfig) {
    super(config)
  }


  dirContent(params: {path: string}): ListStore {
    const storeId = this.makeFullFilePath(params.path)
    let updateHandlerIndex: number
    const trueStore = this.registerOrGetStore(
      storeId,
      () => {
        updateHandlerIndex = this.updateEvent.addListener(
          (action: UpdateEvent, pathTo: string, newData: string[]) => {
            if (action !== UpdateEvent.dirUpdated) return
            // TODO: проверить что правильные пути относительно корня
            if (storeId === pathTo) {
              listStore.$$setValue(newData, false, false, newData.length)
            }
          }
        )
        // TODO: listen file updates and update value of dataStore
      },
      () => {
        this.updateEvent.removeListener(updateHandlerIndex)
      }
    )
    const listStore = makeListStore(trueStore, [])

    this.makeRequest<{result: string[]}>(`load-dir?path=${encodeURIComponent(params.path)}`)
      .then((response) => {
        const result = response.data.result

        listStore.$$setValue(result, false, false, result.length)
      })
      .catch(this.handleRequestError)

    return listStore
  }

  dataFile(params: {path: string}): ItemStore {
    const storeId = this.makeFullFilePath(params.path)
    let updateHandlerIndex: number
    const trueStore = this.registerOrGetStore(
      storeId,
      () => {
        updateHandlerIndex = this.updateEvent.addListener(
          (action: UpdateEvent, pathTo: string, newData: string) => {
            // TODO: проверить что правильные пути относительно корня
            if (storeId !== pathTo) return

            switch (action) {
              case UpdateEvent.fileUpdated:
                itemStore.$$setValue(newData)
                break;
              case UpdateEvent.fileRemoved:
                // TODO: что делать если файл удалён ???
                break;
            }
          }
        )
      },
      () => {
        this.updateEvent.removeListener(updateHandlerIndex)
      }
    )
    const itemStore = makeItemStore(trueStore, null)

    this.makeRequest<{result: string}>(`load-file?path=${encodeURIComponent(params.path)}`)
      .then((response) => {
        const dataObj = yaml.parse(response.data.result)

        itemStore.$$setValue(dataObj)
      })
      .catch(this.handleRequestError)

    // TODO: listen file updates and update value of dataStore

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
