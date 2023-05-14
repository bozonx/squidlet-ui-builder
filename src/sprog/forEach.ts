import {Spromise} from './lib/Spromise.js';

/*
 * Super for each cycle
 * * It allows to iteract arrays and objects
 * example yaml:
 *   $exp: forEach
 *   src: [0,1,2]
 *   do:
 *     $exp: superFunc
 *     lines:
 *       - $exp: jsCall
 */

interface ForEachParams {
  src: any[] | Record<string, any>
  // default is 'item'
  //as?: string
  do: (p: {item: any, index: string | number}) => Spromise<void>
}

//export const FOR_EACH_DEFAULT_AS_NAME = 'item'


export function forEach(scope: Record<string, any> = {}) {
  return (p: ForEachParams) => {
    if (Array.isArray(p.src)) {
      for (const indexStr in p.src) {
        const index = Number(indexStr)
        const item = p.src[index]

        // TODO: await

        p.do({item, index})
      }
    }
    else if (typeof p.src === 'object') {
      for (const index of Object.keys(p.src)) {
        const item = p.src[index]

        // TODO: await

        p.do({item, index})
      }
    }
    else {
      throw new Error(`Unsupported types of src: ${typeof p.src}`)
    }
  }
}
