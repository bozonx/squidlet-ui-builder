import {simpleCall} from './lang/simpleCall.js';
import {getPrimitive} from './lang/superPrimitive.js';
import {superCall, superFunc} from './lang/superFunc.js';


/*
 * SuperProg visual programming language
 */


export const sprogFuncs = {
  ////// JS
  // getJsValue,
  // setJsValue,
  // newJsVar,
  jsCall: simpleCall,
  // jsFunc,
  // funcReturn,

  ////// PRIMITIVE
  getPrimitive,

  ////// SUPER
  // forEach,
  superCall,
  superFunc,
}
