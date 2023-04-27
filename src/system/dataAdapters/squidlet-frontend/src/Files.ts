import {FileWrapper} from './FileWrapper.js';


export class Files {
  instantiateStringFile(filePath: string) {
    return new FileWrapper(filePath)
  }
}
