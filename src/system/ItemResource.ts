import {LocalFiles} from './dataAdapters/LocalFiles.js';

export class ItemResource {

  constructor(adapterName: string, adapterConfig: Record<string, any>) {

  }

  run() {
    const aa = new LocalFiles()
  }
}
