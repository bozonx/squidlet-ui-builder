import {mergeDeepObjects, cloneDeepObject} from 'squidlet-lib'
import {AllTypes} from './types.js'
import {SuperScope} from '../scope.js'


export interface SuperFuncParam {
  type: AllTypes
  // TODO: do it need to rename some params?
}

export interface SuperFuncArgs {
  params: Record<string, SuperFuncParam>
  lines: any[]
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
  private readonly params: Record<string, SuperFuncParam>
  // TODO: какой тип???
  private readonly lines: any[]
  private appliedValues: Record<string, any> = {}


  constructor(scope: SuperScope, {params, lines}: SuperFuncArgs) {
    this.scope = scope
    this.params = params
    this.lines = lines
  }


  getScope(): SuperScope {
    return this.scope
  }

  replaceScope(newScope: SuperScope) {
    this.scope = newScope
  }

  /**
   * Apply values of function's params to exec function later.
   * It replaces previously applied values
   */
  applyValues(values: Record<string, any>) {
    this.appliedValues = values
  }

  /**
   * Apply values of function's params to exec function later.
   * It merges new values with previously applied values
   */
  mergeValues(values: Record<string, any>) {
    this.appliedValues = mergeDeepObjects(values, this.appliedValues)
  }

  async exec(values?: Record<string, any>): ProxyHandler<any> {
    const finalValues = mergeDeepObjects(values, this.appliedValues)



    for (const line of this.lines) {
      await this.scope.run(line)
    }

    // TODO: add var definition
    // TODO: add return definition
  }

  /**
   * Make clone of function include applied params
   * but with the same scope
   */
  clone(newScope?: SuperScope, values?: Record<string, any>) {
    const newSuperFunc = new SuperFunc(
      newScope || this.scope,
      mergeDeepObjects(values, this.appliedValues)
    )

    return new Proxy(newSuperFunc, superFuncProxyHandler)
  }

}
