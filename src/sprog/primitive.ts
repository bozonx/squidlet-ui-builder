import {objGet} from 'squidlet-lib'
import {SprogFn} from './index.js';


export const getPrimitive: SprogFn = (scope: Record<string, any> = {}) => {
  return async (p: {path: string}): Promise<any> => {

    // TODO: учитывать что по пути может быть superStruct или superArray

    return objGet(scope, p.path)
  }
}
