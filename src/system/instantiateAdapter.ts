import {LocalFiles} from './dataAdapters/LocalFiles.js';


const adapters: Record<string, any> = {
  LocalFiles,
}


export function instantiateAdapter(adapterName: string, config: Record<string, any>): any {
  return new adapters[adapterName](config)
}
