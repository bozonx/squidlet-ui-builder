import type {FileStatus} from './interfaces/FileStatus';


export class FileWrapper {
  private status: FileStatus = {
    loaded: false,
    exists: null,
  }
  private filePath: string


  get loaded(): boolean {
    return this.status.loaded
  }

  get exists(): boolean | null {
    return this.status.exists
  }


  constructor(filePath: string) {
    this.filePath = filePath
  }

  async getStringContent(): Promise<string> {
    // TODO: load content
    // TODO: cache content for couple of minutes
    // TODO: if content is cached then give it

    if (this.filePath === 'screensMenu') {

    }
    else if (this.filePath === 'menu/components') {

    }
    else if (this.filePath === 'menu/commonElements') {

    }
    else if (this.filePath === 'menu/orderedLibs') {

    }
    else if (this.filePath === 'enabledLibs') {

    }
    else if (this.filePath === 'elements/00000001') {

    }
    else if (this.filePath === 'elements/00000002') {

    }
    else if (this.filePath === 'elements/00000004') {

    }
    else if (this.filePath === 'elements/00000005') {

    }
  }

  onUpdated() {
    // TODO: add
  }

  onDeleted() {
    // TODO: add
  }

  // TODO: add other methods

}
