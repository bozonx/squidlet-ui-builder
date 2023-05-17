import {objGet} from 'squidlet-lib'
import {SprogFn} from './index.js';
import {NodeVM} from 'vm2'


/*
 * Call js function
 * example yaml template:
 *   $ext: jsCall
 *   path: myFunc
 *   $jsExp: console.log(param)
 *   async: true
 *   args:
 *     - 1
 *     - 'some value'
 */

export const  jsCall: SprogFn = (scope: Record<string, any> = {}) => {
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
