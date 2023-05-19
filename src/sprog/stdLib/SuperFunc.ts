import {AllTypes} from './types.js';
import {SuperScope} from '../scope.js';


export interface SuperFuncParam {
  type: AllTypes

}


export class SuperFunc {


  constructor() {
  }



  getScope() {

  }

  replaceScope(newScope: SuperScope) {

  }

  /**
   * Apply values of function's params to exec function later
   */
  applyValues(values: Record<string, any>) {

  }

  exec(values?: Record<string, any>) {

  }

  /**
   * Make clone of function include applied params
   * but with the same scope
   */
  clone(newScope?: SuperScope, values?: Record<string, any>) {

  }

}
