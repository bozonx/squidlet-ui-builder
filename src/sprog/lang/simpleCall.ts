import {SprogFn, SuperScope} from '../scope.js';
import {NodeVM} from 'vm2'


/**
 * Execute JS expression and return result.
 * Params:
 *   $exp: jsExp
 *   exp: 'console.log(varFromScope)'
 */
export const jsExp: SprogFn = (scope: SuperScope) => {
  return async (p: {exp?: string}): Promise<any | void> => {
    if (typeof p.exp === 'undefined') return

    // TODO: exp может быть выражением

    const vm = new NodeVM({
      sandbox: scope
    })

    return vm.run(p.exp)
  }
}

/*
 * Call js function
 * example yaml template:
 *   $ext: simpleCall
 *   path: myFunc
 *   $jsExp: console.log(param)
 *   async: true
 *   args:
 *     - 1
 *     - 'some value'
 */

export const  simpleCall: SprogFn = (scope: SuperScope) => {
  return async (p: {$jsExp?: string, path?: string, async?: boolean, args?: any[]}): Promise<any | void> => {

    console.log(2222, scope, p)

    if (p.$jsExp) {
      const vm = new NodeVM({
        sandbox: scope
      })

      return vm.run(p.$jsExp)
    }

    // const func = objGet(scope, p.path)
    //
    // if (!func) throw new Error(`Can't find function ${p.path}`)
    //
    // // TODO: add async
    //
    // return func(...p.args)
  }
}
