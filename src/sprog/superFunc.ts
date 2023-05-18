import {deepGet} from 'squidlet-lib'
import {SprogFn, SuperScope} from './index.js';


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
 * Define super function
 * vars - top level vars or functions of function scope
 * as - rename some income params
 * lines - any code execution include set vars
 */
export const superFunc: SprogFn = (scope: SuperScope) => {
  return async (p: {
    vars: Record<string, any>,
    lines?: any[],
    return?: any
  }): Promise<any | void> => {
    if (p.vars) {
      for (const varName of Object.keys(p.vars)) {
        scope.context[varName] = await scope.run(p.vars[varName])
      }
    }

    for (const line of p.lines || []) {
      await scope.run(line)
    }

    // if (p.return) {
    //   return await scope.run(scope, p.return)
    // }
  }
}
