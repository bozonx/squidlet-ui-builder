import {SprogItemDefinition, SuperScope} from '../scope.js';


interface IfElseItem {
  condition: SprogItemDefinition[]
  block: SprogItemDefinition[]
}

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
  return async (p: { items: IfElseItem[] }) => {
    for (const rawItem of p.items) {
      const item = await scope.$resolve(rawItem)

      if (!item) return false
    }

    // TODO: 1е всегда if
    // TODO: в середине всегда if else
    // TODO: последнее всегда else или if else
  }
}
