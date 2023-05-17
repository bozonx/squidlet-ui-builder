import {objGet} from 'squidlet-lib'
import {SprogFn} from './index.js';


export const getPrimitive: SprogFn = (scope: Record<string, any>) => {
  return async (p: {path: string}): Promise<any> => {

    // TODO: учитывать что по пути может быть superStruct или superArray

    // TODO: objGet не работает с массивами !!!



    console.log(666, scope, p, objGet(scope, p.path))


    return objGet(scope, p.path)
  }
}
