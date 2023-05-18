import {deepGet, objSetMutate} from 'squidlet-lib'


/*
 * Get and set js value
 * example yaml template for get value:
 *   $exp: getJsValue
 *   path: obj.param1
 *
  * example yaml template for set value:
 *   $exp: getJsValue
 *   path: obj.param1
 *   value: 2
 *
  * example yaml template for set value:
 *   $exp: getJsValue
 *   path: obj.param1
 *   value:
 *     $exp: getJsValue
 *     path: otherObj.param2
 */

// TODO: может задать значение по умолчанию???

export function getJsValue(scope: Record<string, any> = {}) {
  return (p: {path: string}): any | undefined => {
    return deepGet(scope, p.path)
  }
}

/**
 * Set to existent or not existent variable.
 * If some path parts doesn't exist then it will create them
 */
export function setJsValue(scope: Record<string, any> = {}) {
  return (p: {path: string, value: any}) => {
    objSetMutate(scope, p.path, p.value)
  }
}

/**
 * Register new var only if it doesn't exists.
 * If you don't have to chech it then better to use setJsValue
 */
export function newJsVar(scope: Record<string, any> = {}) {
  return (p: {name: string, value: any}) => {
    if (Object.keys(scope).indexOf(p.name) >= 0) {
      throw new Error(`Can't reinitialize existent var ${p.name}`)
    }

    scope[p.name] = p.value
  }
}
