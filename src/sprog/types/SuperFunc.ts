import {AllTypes} from './types.js';
import {SuperScope} from '../scope.js';


export interface SuperFuncParam {
  type: AllTypes

}

export interface SuperFuncArgs {
  params: Record<string, SuperFuncParam>
  lines?: any[]
}


export const superFuncProxyHandler: ProxyHandler<SuperFunc> = {
  apply(target: SuperFunc, thisArg: any, argArray: any[]) {
    return target.exec(...argArray)
  },

  get(target: SuperFunc, p: keyof SuperFunc, receiver: any): any {

    // TODO: что использовать target или receiver ???

    return receiver[p]
  },

  has(target: SuperFunc, p: keyof SuperFunc): boolean {
    return Boolean(target[p])
  }
}


export class SuperFunc {

  private scope: SuperScope


  constructor(scope: SuperScope, args: SuperFuncArgs) {
    this.scope = scope
  }


  getScope(): SuperScope {
    return this.scope
  }

  replaceScope(newScope: SuperScope) {
    this.scope = newScope
  }

  /**
   * Apply values of function's params to exec function later
   */
  applyValues(values: Record<string, any>) {

  }

  async exec(args?: Record<string, any>): ProxyHandler<any> {
    //const a = new Proxy()


    // TODO: do it need to rename it?

    // if (p.vars) {
    //   for (const varName of Object.keys(p.vars)) {
    //     scope.context[varName] = await scope.run(p.vars[varName])
    //   }
    // }

    for (const line of p.lines || []) {
      await this.scope.run(line)
    }

    // if (p.return) {
    //   return await scope.run(scope, p.return)
    // }

    // TODO: add var definition
    // TODO: add return definition
  }

  /**
   * Make clone of function include applied params
   * but with the same scope
   */
  clone(newScope?: SuperScope, values?: Record<string, any>) {

  }

}
