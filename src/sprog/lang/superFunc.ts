import {deepGet} from 'squidlet-lib'
import {SprogFn, SuperScope} from '../scope.js'
import {makeSuperFuncProxyHandler, SuperFunc, SuperFuncArgs} from '../types/SuperFunc.js'
import {EXP_MARKER} from '../constants.js'


/**
 * Call super function. It always await.
 * args:
 *   * path {string} - path to super function in scope
 *   * params {Object} - parameters of super function which will be called
 */
export const superCall: SprogFn = (scope: SuperScope) => {
  return async (p: {path: string, params: Record<string, any>}): Promise<void> => {
    const fn = deepGet(scope, p.path)

    if (!fn) throw new Error(`Can't find super function ${p.path}`)

    const finalParams: Record<string, any> = {}
    // collect function params
    for (const paramName of Object.keys((p.params))) {
      // execute if it is expression
      if (typeof p.params[paramName] === 'object' && p.params[paramName][EXP_MARKER]) {
        finalParams[paramName] = await scope.run(p.params[paramName])
      }
      else {
        finalParams[paramName] = p.params[paramName]
      }
    }

    return fn(finalParams)
  }
}

/**
 * Define super function. Which is always async.
 * Params:
 *   * params - define income params, their type and default value
 *   * lines - any code execution include set vars
 */
export const superFunc: SprogFn = (scope: SuperScope) => {

  // TODO: а должно ли быть async тут???

  return async (p: SuperFuncArgs): Promise<any> => {
    const newSuperFunc = new SuperFunc(scope, p)

    return newSuperFunc.clone()
  }
}
