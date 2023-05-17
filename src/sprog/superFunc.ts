import {SprogFn} from './index.js';



export const superCall: SprogFn = (scope: Record<string, any> = {}) => {
  return async (p: {lines: any[]}): Promise<void> => {

  }
}

/**
 * Define super function
 * vars - top level vars or functions of function scope
 * as - rename some income params
 * lines - any code execution include set vars
 * return - value to return
 */
export const superFunc: SprogFn = (scope: Record<string, any> = {}) => {
  return async (p: {lines: any[]}): Promise<void> => {
    for (const line of p.lines) {
      scope.sprogRun(scope, line)
    }

  }
}
