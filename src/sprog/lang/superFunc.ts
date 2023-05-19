import {deepGet} from 'squidlet-lib'
import {SprogFn, SuperScope} from '../scope.js';
import {SuperFuncParam} from '../stdLib/SuperFunc.js';


/**
 * Call super function. It always await.
 * params:
 *   * path {string} - path to super function in scope
 *   * params {Object} - parameters of super function which will be called
 */
export const superCall: SprogFn = (scope: SuperScope) => {
  return async (p: {path: string, params: Record<string, any>}): Promise<void> => {
    const fn = deepGet(scope, p.path)

    if (!fn) throw new Error(`Can't find super function ${p.path}`)

    const finalParams: Record<string, any> = {}


    for (const paramName of Object.keys((p.params))) {
      if (typeof p.params[paramName] === 'object' && p.params[paramName].$exp) {
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
  return async (p: {params: Record<string, SuperFuncParam>, lines?: any[]}): Promise<any | void> => {

    // TODO: do it need to rename it?

    // if (p.vars) {
    //   for (const varName of Object.keys(p.vars)) {
    //     scope.context[varName] = await scope.run(p.vars[varName])
    //   }
    // }

    for (const line of p.lines || []) {
      await scope.run(line)
    }

    // if (p.return) {
    //   return await scope.run(scope, p.return)
    // }

    // TODO: add var definition
    // TODO: add return definition
  }
}
