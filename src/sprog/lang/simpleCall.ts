import {SprogFn, SuperScope} from '../scope.js';
import {NodeVM} from 'vm2'


/**
 * Execute JS expression and return result.
 * Params:
 *   $exp: jsExp
 *   exp: 'console.log(varFromScope)'
 * Param "exp" and be an expression
 */
export const jsExp: SprogFn = (scope: SuperScope) => {
  return async (p: {exp?: string}): Promise<any | void> => {
    if (typeof p.exp === 'undefined') return

    const exp: string = await scope.$resolve(p.exp)

    const vm = new NodeVM({
      sandbox: scope
    })

    return vm.run(exp)
  }
}

/**
 * Call js function
 * example yaml template:
 *   $ext: simpleCall
 *   path: myFunc
 *   args:
 *     - 1
 *     - 'some value'
 */
export const  jsCall: SprogFn = (scope: SuperScope) => {
  return async (p: {path: string, args?: any[]}): Promise<any | void> => {
    const path: string = await scope.$resolve(p.path)
    const args: string = await scope.$resolve(p.args)
    const func = await scope.$getScopedFn('getValue')({ path })

    if (typeof func !== 'function') {
      throw new Error(`It isn't a function`)
    }

    return func(args)
  }
}
