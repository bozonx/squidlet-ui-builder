import type {FileStatus} from './interfaces/FileStatus';


export class FileWrapper {
  private status: FileStatus = {
    loaded: false,
    exists: null,
  }

  get loaded(): boolean {
    return this.status.loaded
  }

  get exists(): boolean | null {
    return this.status.exists
  }


  constructor(filePath: string) {

  }

  async getContent() {
    // TODO: load content
    // TODO: cache content for couple of minutes
    // TODO: if content is cached then give it
  }

  onUpdated() {
    // TODO: add
  }

  onDeleted() {
    // TODO: add
  }

  // TODO: add other methods

}
