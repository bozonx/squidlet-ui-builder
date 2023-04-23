import {FileWrapper} from './FileWrapper';


export class Files {
  instantiateStringFile(filePath: string) {
    return new FileWrapper(filePath)
  }
}
