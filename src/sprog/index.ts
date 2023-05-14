import {getJsValue, newJsVar, setJsValue} from './jsValue.js';
import {jsCall} from './jsCall.js';
import {superFunc} from './superFunc.js';
import {funcReturn, jsFunc} from './jsFunc.js';
import {forEach} from './forEach.js';


/*
 * SuperProg visual programming language
 */

export const sprog = {
  // JS
  getJsValue,
  setJsValue,
  newJsVar,
  jsCall,
  jsFunc,
  funcReturn,

  // SUPER
  forEach,
  superFunc,
}
