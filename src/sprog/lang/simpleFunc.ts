import {SuperScope} from '../scope.js';


/**
 * Define simple func in the top of scope
 * params:
 *   $exp: simpleFunc
 *   name: nameOfFunction
 *   args: [...someArgs]
 */
export function setSimpleFunc(scope: SuperScope) {
  return async (p: {name: string, args?: any[]}) => {
    const name: string = await scope.$resolve(p.name)
    const args: any | undefined = await scope.$resolve(p.args)

    scope[name] = await makeSimpleFunc(args)
  }
}

/**
 * Create simple func and return it
 * params:
 *   $exp: simpleFunc
 *   args: [...someArgs]
 */
export function makeSimpleFunc(scope: SuperScope) {
  return async (p: {args?: any[]}) => {
    const args: any | undefined = await scope.$resolve(p.args)


  }
}
