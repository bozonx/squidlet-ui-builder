import {SuperValueBase} from '../lib/SuperValueBase.js';
import {SuperScope} from '../scope.js';


export interface SuperArrayItemDefinition {
  // TODO: add
}


export function proxyArray(arr: SuperArray): any[] {
  const handler: ProxyHandler<any[]> = {
    get(target: any[], prop: any) {
      console.log('get', prop)
      // Intercept array element access
      const index = Number(prop);
      if (Number.isInteger(index)) {
        if (index < 0) {
          // Support negative indices (e.g., -1 for last element)
          prop = String(target.length + index);
        }
        return target[prop];
      }

      // Return the usual array properties and methods
      return target[prop];
    },
    set(target: any[], prop, value) {
      // Intercept array element assignment
      console.log('set', prop, value)

      // TODO: push method set value and set length - do it need to catch length set???

      const index = Number(prop);
      if (Number.isInteger(index)) {
        if (index < 0) {
          // Support negative indices (e.g., -1 for last element)
          prop = String(target.length + index);
        }
        target[index] = value;
      } else {
        // Set the usual array properties and methods
        target[index] = value;
      }

      return true
    }

    // TODO: add apply
  }

  return new Proxy(arr.arr, handler)
}


/*
 * Not mutate array methods: length (only prop), concat, copyWithin, entries, every, filter,
 *   find, findIndex, findLast, findLastIndex, flat, flatMap, forEach,
 *   includes, indexOf, join, keys, lastIndexOf, map, slice, toLocaleString,
 *   toString, values, valueOf, some, reduce, reduceRight
 *
 * Methods which are mutate an array: push, pop, shift, unshift, fill, splice, reverse, sort
 *
 */


export class SuperArray<T = any[]> extends SuperValueBase {
  arr: any[] = [0,1]
  private readonly item: SuperArrayItemDefinition


  constructor(scope: SuperScope, item: SuperArrayItemDefinition) {
    super(scope)

    this.item = item
  }


  init() {
    // TODO: return setter for ro array
  }

  destroy() {
    super.destroy()

    // TODO: destroy children
  }


  has() {
    // TODO: deeply
  }

  getValue() {
    // TODO: deeply
  }

  setValue() {
    // TODO: deeply
  }

  resetValue() {
    // TODO: deeply
  }

  clone(): T {

  }

  link() {

  }

  ////// Standart methods
  push() {

  }

  pop() {

  }

  shift() {

  }

  unshift() {

  }

  fill() {

  }

  splice() {

  }

  reverse() {

  }

  sort() {

  }

  ////// PRIVATE

}


// const a = new SuperArray({} as any)
//
// const b = proxyArray(a)
//
// //b[0] = 5
//
// //console.log(b, b[1], b.length)
//
// b.push(6)
