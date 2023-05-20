import {simpleCall} from './lang/simpleCall.js';
import {superCall, superFunc} from './lang/superFunc.js';
import {deleteValue, getValue, setValue} from './lang/deepValue.js';
import {deleteVar, newVar} from './lang/simpleVar.js';
import {jsExp} from './lang/jsExp.js';
import {isLess, logicAnd, isEqual, isGreater, logicNot, logicOr} from './lang/booleanLogic.js';


// TODO: add if
// TODO: add forEach
// TODO: add boolean logic
// TODO: add switch
// TODO: SuperFunc - add return
// TODO: add SuperStruct
// TODO: add SuperArray
// TODO: add SuperPrimitive

// TODO: simple function вообще нужен тогда???

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
  logicAnd,
  logicOr,
  logicNot,
  isEqual,
  isGreater,
  isLess,

  ////// SUPER
  superCall,
  superFunc,
}
