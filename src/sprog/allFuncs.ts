import {jsExp, jsCall} from './lang/simpleCall.js';
import {getPrimitive} from './lang/superPrimitive.js';
import {superCall, superFunc} from './lang/superFunc.js';
import {getValue, setValue} from './lang/deepValue.js';
import {deleteVar, newVar} from './lang/simpleVar.js';


/*
 * SuperProg visual programming language
 */

export const sprogFuncs = {
  ////// JS
  getValue,
  setValue,
  newVar,
  deleteVar,
  jsExp,
  jsCall,

  ////// PRIMITIVE
  getPrimitive,

  ////// SUPER
  // forEach,
  superCall,
  superFunc,
}
