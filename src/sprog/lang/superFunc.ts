import {deepGet} from 'squidlet-lib'
import {SprogFn, SuperScope} from '../scope.js'
import {SuperFunc, SuperFuncArgs} from '../types/SuperFunc.js'
import {EXP_MARKER} from '../constants.js'
import {makeFuncProxy} from '../lib/functionProxy.js';


/**
 * Call super function. It always await.
 * args:
 *   * path {string} - path to super function in scope
 *   * values {Object} - values of super function's props which will be called
 */
export const superCall: SprogFn = (scope: SuperScope) => {
  return async (p: {path: string, values: Record<any, any>}): Promise<void> => {
    const fn = deepGet(scope, p.path)

    if (!fn) throw new Error(`Can't find super function ${p.path}`)

    const finalParams: Record<string, any> = {}
    // collect function params
    for (const paramName of Object.keys((p.values))) {
      // execute if it is expression
      if (typeof p.values[paramName] === 'object' && p.values[paramName][EXP_MARKER]) {
        finalParams[paramName] = await scope.run(p.values[paramName])
      }
      else {
        finalParams[paramName] = p.values[paramName]
      }
    }

    return fn(finalParams)
  }
}

/**
 * Define super function. Which is always async.
 * Params:
 *   * props - define income props, their type and default value
 *   * lines - any code execution include set vars
 */
export const superFunc: SprogFn = (scope: SuperScope) => {
  return async (p: SuperFuncArgs): Promise<any> => {
    const newSuperFunc = new SuperFunc(scope, p)

    return makeFuncProxy(newSuperFunc)
  }
}
