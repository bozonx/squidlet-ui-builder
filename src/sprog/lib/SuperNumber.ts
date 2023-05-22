import {SuperScope} from '../scope.js';


export function proxyNumber(numInstance: SuperNumber): number {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      // Intercept number retrieval
      if (prop === 'value') {
        console.log(`Number retrieval: ${target[prop]}`);

        return target[prop]
      }
    },
    set(target, prop, value) {
      // Intercept number assignment
      if (prop === 'value') {
        console.log(`Number assignment: ${value}`);

        target[prop] = value
      }

      return true
    }
  }

  return new Proxy({value: 0}, handler) as any
}

export class SuperNumber {
  private scope: SuperScope
  private val: number | null


  get value(): number | null {
    return this.val
  }

  set value(newValue: number | null) {
    if (typeof newValue !== 'number' && newValue !== null) {
      throw new Error(`Value can be only number or null`)
    }

    this.val = newValue
  }


  constructor(scope: SuperScope, initialValue: number | null = 0) {
    this.scope = scope
    this.val = initialValue
  }


}
