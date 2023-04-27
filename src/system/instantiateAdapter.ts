import {DataAdapterBase} from './DataAdapterBase.js';
import {LocalFiles} from './dataAdapters/LocalFiles.js';


const adapters: Record<string, typeof DataAdapterBase<any>> = {
  LocalFiles,
}


export function instantiateAdapter(adapterName: string, config: Record<string, any>): DataAdapterBase {
  return new adapters[adapterName](config)
}
