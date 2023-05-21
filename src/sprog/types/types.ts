import {SuperStruct} from './SuperStruct.js';
import {SuperArray} from './SuperArray.js';


export type SuperChangeHandler = (
  // link to element which is changed. It can be a parent or its child
  target: SuperStruct | SuperArray,
  // path to child element which is changed. If '' then it is parent
  path: string
) => void
