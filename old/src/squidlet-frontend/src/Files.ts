import {FileWrapper} from './FileWrapper.ts';


export class Files {
  instantiateStringFile(filePath: string) {
    return new FileWrapper(filePath)
  }
}
