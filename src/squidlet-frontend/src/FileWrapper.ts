import type {FileStatus} from './interfaces/FileStatus.js';
import {testData} from '../testData.js';


export class FileWrapper {
  private status: FileStatus = {
    loaded: false,
    exists: null,
  }
  private readonly filePath: string


  get loaded(): boolean {
    return this.status.loaded
  }

  get exists(): boolean | null {
    return this.status.exists
  }


  constructor(filePath: string) {
    this.filePath = filePath
  }

  async getJsonContent(): Promise<any | any[]> {
    // TODO: load content
    // TODO: cache content for couple of minutes
    // TODO: if content is cached then give it


    return Promise.resolve(testData[this.filePath])
  }

  onUpdated() {
    // TODO: add
  }

  onDeleted() {
    // TODO: add
  }

  // TODO: add other methods

}
