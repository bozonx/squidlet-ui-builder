import {jsCall} from './jsCall.js';
import {getPrimitive} from './superPrimitive.js';
import {superCall, superFunc} from './superFunc.js';


/*
 * SuperProg visual programming language
 */


export const sprogFuncs = {
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
