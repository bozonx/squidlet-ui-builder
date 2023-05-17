import {SprogFn} from './index.js';


/*
 * vars - top level vars or functions of function scope
 * as - rename some income params
 * lines - any code execution include set vars
 * return - value to return
 */


export const superFunc: SprogFn = (scope: Record<string, any> = {}) => {
  return async (p: {lines: any[]}) => {

    console.log(2222, scope, p)

    for (const line of p.lines) {

    }

  }
}
