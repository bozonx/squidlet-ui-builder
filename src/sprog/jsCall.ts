import {objGet} from 'squidlet-lib'


/*
 * Call js function
 * example yaml template:
 *   $ext: jsCall
 *   path: myFunc
 *   async: true
 *   args:
 *     - 1
 */

export function jsCall(scope: Record<string, any> = {}) {
  return (p: {path: string, async: boolean, args: any[]}): any | void => {
    const func = objGet(scope, p.path)

    if (!func) throw new Error(`Can't find function ${p.path}`)

    // TODO: add async

    return func(...p.args)
  }
}
