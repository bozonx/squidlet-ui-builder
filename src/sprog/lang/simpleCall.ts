import {SprogFn, SuperScope} from '../scope.js';
import {NodeVM} from 'vm2'


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
