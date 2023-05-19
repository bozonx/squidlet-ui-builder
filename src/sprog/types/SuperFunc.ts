import {mergeDeepObjects} from 'squidlet-lib'
import {AllTypes} from './types.js'
import {SuperScope} from '../scope.js'
import {makeFuncProxy} from '../lib/functionProxy.js';


export interface SuperFuncParam {
  // type of value
  type: AllTypes
  // default value
  default?: any
  // TODO: do it need to rename some props?
}

export interface SuperFuncArgs {
  props: Record<string, SuperFuncParam>
  lines: any[]
}


export class SuperFunc {
  private scope: SuperScope
  private readonly props: Record<string, SuperFuncParam>
  // TODO: какой тип???
  private readonly lines: any[]
  private appliedValues: Record<string, any> = {}


  get propsDefaults(): Record<any, any> {

    // TODO: move to squidlet-lib

    const res: Record<any, any> = {}

    for (const key of Object.keys(this.props)) {
      if (typeof this.props[key].default === 'undefined') continue

      res[key] = this.props[key].default
    }

    return res
  }


  constructor(scope: SuperScope, {props, lines}: SuperFuncArgs) {
    this.scope = scope
    this.props = props
    this.lines = lines
  }


  getScope(): SuperScope {
    return this.scope
  }

  replaceScope(newScope: SuperScope) {
    this.scope = newScope
  }

  /**
   * Apply values of function's props to exec function later.
   * It replaces previously applied values
   */
  applyValues(values: Record<string, any>) {

    // TODO: validate props

    this.appliedValues = values
  }

  /**
   * Apply values of function's props to exec function later.
   * It merges new values with previously applied values
   */
  mergeValues(values: Record<string, any>) {
    this.appliedValues = mergeDeepObjects(values, this.appliedValues)
  }

  async exec(values?: Record<string, any>): Promise<any> {

    // TODO: validate props

    const finalValues = mergeDeepObjects(
      values,
      mergeDeepObjects(this.appliedValues, this.propsDefaults)
    )

    console.log(111, values, finalValues, this.lines, this.props)

    for (const line of this.lines) {
      await this.scope.run(line)
    }

    // TODO: add var definition
    // TODO: add return definition
  }

  /**
   * Make clone of function include applied props
   * but with the same scope
   */
  clone(newScope?: SuperScope, values?: Record<string, any>) {
    const newSuperFunc = new SuperFunc(
      newScope || this.scope,
      {props: this.props, lines: this.lines}
    )

    if (values) newSuperFunc.applyValues(values)

    return makeFuncProxy(newSuperFunc)
  }

}
