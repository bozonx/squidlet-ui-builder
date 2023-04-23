import type {FileStatus} from './interfaces/FileStatus';
import type {Screen} from '../../lib/interfaces/Screen'
import type {ScreensMenuFile} from '../../lib/interfaces/ScreensMenuFile';


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

  async getJsonContent(): Promise<any> {
    // TODO: load content
    // TODO: cache content for couple of minutes
    // TODO: if content is cached then give it

    if (this.filePath === 'screensMenu') {
      return [
        {
          screenId: '00000011',
          children: [
            '00000012'
          ]
        }
      ] as ScreensMenuFile[]
    }
    else if (this.filePath === 'menu/components') {

    }
    else if (this.filePath === 'menu/commonElements') {

    }
    else if (this.filePath === 'menu/orderedLibs') {

    }
    else if (this.filePath === 'enabledLibs') {

    }
    else if (this.filePath === 'screens/00000011') {
      return {
        $id: '00000011',
        name: 'about',
      } as Screen
    }
    else if (this.filePath === 'screens/00000012') {
      return {
        $id: '00000012',
        name: 'nested'
      } as Screen
    }
    else if (this.filePath === 'elements/00000001') {
      return {

      }
    }
    else if (this.filePath === 'elements/00000002') {

    }
    else if (this.filePath === 'elements/00000004') {

    }
    else if (this.filePath === 'elements/00000005') {

    }

    throw new Error('No path')
  }

  onUpdated() {
    // TODO: add
  }

  onDeleted() {
    // TODO: add
  }

  // TODO: add other methods

}
