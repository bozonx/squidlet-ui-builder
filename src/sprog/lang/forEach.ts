import {lastItem} from 'squidlet-lib';
import {newScope, SprogItemDefinition, SuperScope} from '../scope.js';


interface ForEachParams {
  reverse?: boolean
  src: any[] | Record<string, any>
  // default is 'item'
  //as?: string
  do: SprogItemDefinition[]
}

interface ForEachLocalScope {
  i: number
  key: number | string
  item: SprogItemDefinition
  $isFirst: i === firstIndex,
  $isLast: i === laseIndex,
  // TODO: add skips
  //$skipNext
  //$skip
  //$toStep
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
 *   * $isFirst - is this first index
 *   * $isLast - is this last index
 *   * $skipNext() - just skip the next step
 *   * $skip(numberOfSteps) - will skip specified number of steps bot not greater than the last one
 *   * $toStep(stepNumber) - go to the next specified step number. Not previous
 */
export function forEach(scope: SuperScope) {
  return async (p: ForEachParams) => {
    const src: Record<any, any> | any[] = await scope.$resolve(p.src)

    if (Array.isArray(src)) {
      const firstIndex = (p.reverse) ? src.length - 1 : 0
      const laseIndex = (p.reverse) ? 0 : src.length - 1
      // array iteration
      for (
        let i = (p.reverse) ? src.length - 1 : 0;
        (p.reverse) ? i >= src.length : i < src.length;
        (p.reverse) ? i-- : i++
      ) {
        const localScope = newScope({
          i,
          key: i,
          item: src[i],
          $isFirst: i === firstIndex,
          $isLast: i === laseIndex,
          // TODO: add skips
          //$skipNext
          //$skip
          //$toStep
        }, scope)

        for (const oneDo of p.do) {
          await localScope.$run(oneDo)
        }

        if (p.reverse) i--
        else i++
      }
    }
    else if (typeof src === 'object') {
      const keys = Object.keys(src)
      let i = (p.reverse) ? keys.length - 1 : 0
      // object iteration
      for (
        let i = (p.reverse) ? keys.length - 1 : 0;
        (p.reverse) ? i >= keys.length : i < keys.length;
        (p.reverse) ? i-- : i++
      ) {
        const keyStr = keys[i]
        const localScope = newScope({
          i,
          key: keyStr,
          item: src[keyStr],
          $isFirst: keys[0] === keyStr,
          $isLast: lastItem(keys) === keyStr,
          // TODO: add skips
          //$skipNext
          //$skip
          //$toStep
        }, scope)

        for (const oneDo of p.do) {
          await localScope.$run(oneDo)
        }
      }
    }
    else {
      throw new Error(`Unsupported types of src: ${typeof src}`)
    }
  }
}
