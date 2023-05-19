import {simpleCall} from './lang/simpleCall.js';
import {superCall, superFunc} from './lang/superFunc.js';
import {deleteValue, getValue, setValue} from './lang/deepValue.js';
import {deleteVar, newVar} from './lang/simpleVar.js';
import {jsExp} from './lang/jsExp.js';



// TODO: add simpleFunc
// TODO: add forEach
// TODO: add if
// TODO: add switch
// TODO: add SuperStruct
// TODO: add SuperArray
// TODO: add SuperPrimitive

// TODO: add module
// TODO: add simpleClass
// TODO: add SuperClass

/*
 * SuperProg visual programming language
 */

export const sprogFuncs = {
  ////// JS
  getValue,
  setValue,
  deleteValue,
  newVar,
  deleteVar,
  jsExp,
  simpleCall,

  ////// SUPER
  superCall,
  superFunc,
}
