import {objGet, objSetMutate} from 'squidlet-lib'


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
    return objGet(scope, p.path)
  }
}

export function setJsValue(scope: Record<string, any> = {}) {
  return (p: {path: string, value: any}) => {
    objSetMutate(scope, p.path, p.value)
  }
}
