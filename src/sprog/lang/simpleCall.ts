import {SprogFn, SuperScope} from '../scope.js';
import {NodeVM} from 'vm2'
import {EXP_MARKER} from '../constants.js';


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

    let finalExp: string = p.exp

    if (typeof p.exp === 'object' && p.exp[EXP_MARKER]) {
      finalExp = await scope.run(p.exp)
    }

    const vm = new NodeVM({
      sandbox: scope
    })

    return vm.run(finalExp)
  }
}

/*
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
    const func = await scope.$getScopedFn('getValue')({
      path: p.path
    })

    // TODO: path может быть выражением
    // TODO: args может быть выражением


    if (typeof func !== 'function') {
      throw new Error(`It isn't a function`)
    }

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
