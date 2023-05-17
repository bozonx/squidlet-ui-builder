import {omitObj} from 'squidlet-lib';
import {getJsValue, newJsVar, setJsValue} from './jsValue.js';
import {jsCall} from './jsCall.js';
import {superFunc} from './superFunc.js';
import {funcReturn, jsFunc} from './jsFunc.js';
import {forEach} from './forEach.js';


export type SprogFn = (scope?: Record<string, any>) =>
  (p: Record<any, any>) => Promise<any | undefined>



/*
 * SuperProg visual programming language
 */

export const sprog: Record<string, SprogFn> = {
  // // JS
  // getJsValue,
  // setJsValue,
  // newJsVar,
  // jsCall,
  // jsFunc,
  // funcReturn,
  //
  // // SUPER
  // forEach,
  // superFunc,
}


export async function callSprog(scope: Record<any, any>, p: {$exp: keyof typeof sprog, [index: string]: any}) {
  const sprogFn = sprog[p.$exp]
  const params = omitObj(p, '$exp')

  return sprogFn(scope)(params)
}
