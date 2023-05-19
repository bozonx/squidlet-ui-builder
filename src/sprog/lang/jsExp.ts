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
