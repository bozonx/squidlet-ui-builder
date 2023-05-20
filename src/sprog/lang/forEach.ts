import {SuperPromise} from '../types/SuperPromise.js';


// TODO: add setIterator - установить значение I
// TODO: add isFirst
// TODO: add isLast
// TODO: add skipNext()
// TODO: add skip(num) - пропусть заданое количество шагов
// TODO: add reverse - в обратном порядке

interface ForEachParams {
  src: any[] | Record<string, any>
  // default is 'item'
  //as?: string
  do: (p: {item: any, index: string | number}) => SuperPromise<void>
}


/**
 * Super for each cycle
 * It allows to iteract arrays and objects
 * params:
 *   $exp: forEach
 *   # default is false. If true then the cycle will start from the end
 *   reverse: false
 *   # src is a source array to iteract
 *   src:
 *     $exp: getValue
 *     path: somePath
 *   # do is an array of expressions which are called in local scope
 *   do:
 *     - $exp: setValue
 *       path: somePath
 *       value: 5
 * In local scope will be:
 *   * i number of iteration
 *   * key - string if it is an object and number if it is an array
 *   * value - current value
 *   * $skip(numberOfSteps) - will skip specified number of steps bot not greater than the last one
 *   * $toStep(stepNumber) - go to the next specified step number. Not previous
 */
export function forEach(scope: Record<string, any> = {}) {
  return (p: ForEachParams) => {

    // TODO: проверить чтобы do было superFunc а не обычной

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
