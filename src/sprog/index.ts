import {omitObj} from 'squidlet-lib';
import {jsCall} from './jsCall.js';
import {superCall, superFunc} from './superFunc.js';
import {getPrimitive} from './primitive.js';


export type SprogFn = (scope?: Record<string, any>) =>
  (p: any) => Promise<any | void>



/*
 * SuperProg visual programming language
 */

export const sprogFuncs: Record<string, SprogFn> = {
  ////// JS
  // getJsValue,
  // setJsValue,
  // newJsVar,
  jsCall,
  // jsFunc,
  // funcReturn,

  ////// PRIMITIVE
  getPrimitive,

  ////// SUPER
  // forEach,
  superCall,
  superFunc,
}


export async function sprogRun(rawScope: Record<any, any>, p: {$exp: keyof typeof sprogFuncs, [index: string]: any}) {
  const sprogFn = sprogFuncs[p.$exp]
  const params = omitObj(p, '$exp')
  const scope = {
    ...rawScope,
    sprogRun,
  }

  if (!sprogFn) throw new Error(`Sprog doesn't have function ${p.$exp}`)

  return sprogFn(scope)(params)
}
