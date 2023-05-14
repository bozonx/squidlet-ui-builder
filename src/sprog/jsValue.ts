import {objGet, objSetMutate} from 'squidlet-lib'


/*
 * Get and set js value
 */

// TODO: может задать значение по умолчанию???

export function getJsValue(scope: Record<string, any> = {}): any | undefined {
  return (p: {path: string}) => {
    objGet(scope, p.path)
  }
}

export function setJsValue(scope: Record<string, any> = {}) {
  return (p: {path: string, value: any}) => {
    objSetMutate(scope, p.path, p.value)
  }
}
