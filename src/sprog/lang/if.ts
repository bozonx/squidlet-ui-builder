import {SuperScope} from '../scope.js';


/**
 * If else conditions
 * params:
 *   $exp: ifElse
 *   items:
 *     - condition:
 *         - $exp: logicAnd
 *           items:
 *             - $exp: logicEqual
 *               values:
 *                 - 5
 *                 - $exp: getValue
 *                   path: somePath
 *       block:
 *         - $exp: setValue
 *           path: someVar
 *           value: 5
 */
export function ifElse(scope: SuperScope) {
  return async (p: { name: string }) => {
    // TODO: 1е всегда if
    // TODO: в середине всегда if else
    // TODO: последнее всегда else или if else
  }
}
