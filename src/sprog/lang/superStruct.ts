import {SuperScope} from '../scope.js';
import {SuperStruct, SuperStructDefinition} from '../types/SuperStruct.js';


export function newSuperStruct(scope: SuperScope) {
  return async (p: {
    definition: SuperStructDefinition,
    defaultRo?: boolean
  }): Promise<SuperStruct> => {
    const definition = await scope.$resolve(p.definition)
    const defaultRo = await scope.$resolve(p.defaultRo)

    return new SuperStruct(scope, definition, defaultRo)
  }
}
