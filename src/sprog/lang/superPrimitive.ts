import {SuperScope} from '../scope.js';
import {proxyNumber, SuperNumber} from '../lib/SuperNumber.js';


export function newSuperNumber(scope: SuperScope) {
  return async (p: {initialValue: number}): Promise<number> => {
    const numInstance = new SuperNumber(scope, p.initialValue)

    return proxyNumber(numInstance)
  }
}

(async () => {
  let a = await newSuperNumber({} as any)({initialValue: 5})

  //a = 6

  console.log(111, a)
})()

