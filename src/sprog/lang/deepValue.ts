import {deepGet, deepSet} from 'squidlet-lib'


/**
 * Get simple or super value deeply from scope
 * params:
 *   $exp: getValue
 *   path: obj.param1
 * It supports arrays path like obj.arr[0].param.
 * Path can be an expression
 * @param scope
 */

export function getValue(scope: Record<string, any> = {}) {

  // TODO: path может быть exp

  return async (p: {path: string, defaultValue?: any}): Promise<any | undefined> => {
    return deepGet(scope, p.path, p.defaultValue)
  }
}

/**
 * Set to existent or not existent variable.
 * If some path parts doesn't exist then it will create them.
 * It supports arrays path like obj.arr[0].param.
 * params:
 *   $exp: setDeepValue
 *   path: obj.param1
 *   value: 1
 * or you can use expression
 *   $exp: setValue
 *     path: obj.param1
 *     value:
 *       $exp: getValue
 *       path: otherObj.param2
 */
export function setValue(scope: Record<string, any> = {}) {

  // TODO: path может быть exp
  // TODO: value может быть exp


  return async (p: {path: string, value: any}) => {
    deepSet(scope, p.path, p.value)
  }
}
