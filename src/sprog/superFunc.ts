import {objGet} from 'squidlet-lib'
import {SprogFn, SprogScope} from './index.js';


export const superCall: SprogFn = (scope: SprogScope) => {
  return async (p: {path: string, params: Record<string, any>}): Promise<void> => {
    const fn = objGet(scope, p.path)

    if (!fn) throw new Error(`Can't find super function ${p.path}`)

    const finalParams: Record<string, any> = {}

    for (const paramName of Object.keys((p.params))) {
      if (typeof p.params[paramName] === 'object' && p.params[paramName].$exp) {
        finalParams[paramName] = await scope.sprogRun(scope, finalParams[paramName])
      }
      else {
        finalParams[paramName] = p.params[paramName]
      }
    }

    return fn(finalParams)
  }
}

/**
 * Define super function
 * vars - top level vars or functions of function scope
 * as - rename some income params
 * lines - any code execution include set vars
 * return - value to return
 */
export const superFunc: SprogFn = (scope: SprogScope) => {
  return async (p: {lines: any[]}): Promise<void> => {

    // TODO: add vars

    for (const line of p.lines) {
      await scope.sprogRun(scope, line)
    }
  }
}
