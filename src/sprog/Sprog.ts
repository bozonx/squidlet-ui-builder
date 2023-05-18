import {omitObj, mergeDeepObjects, cloneDeepObject} from 'squidlet-lib';
import {sprogFuncs} from './index.js';


export type SprogScopedFn = (p: any) => Promise<any | void>
export type SprogFn = (scope: SuperScope) => SprogScopedFn

export interface SuperScope {
  /**
   * Clone only self scope props excluding run() and $cloneSelf()
   */
  $cloneSelf(): any

  /**
   * Get scoped function to run it later
   */
  $getScopedFn(fnName: string): SprogScopedFn

  /**
   * Run sprog function in this scope
   */
  run(definition: SprogItemDefinition): Promise<any | void>
  [index: string]: any
}

export interface SprogItemDefinition {
  $exp: keyof typeof sprogFuncs,
  // TODO: better to extend interfaces
  [index: string]: any
}


const SCOPE_FUNCTIONS = ['run', '$clone']


export function newScope<T = any>(initialScope: T = {} as T, previousScope?: SuperScope): T & SuperScope {
  const fullScope: T = mergeDeepObjects(
    initialScope as any,
    omitObj(previousScope, ...SCOPE_FUNCTIONS)
  )

  return {
    ...fullScope,
    $cloneSelf(): T {
      return cloneDeepObject(omitObj(fullScope as any, ...SCOPE_FUNCTIONS))
    },
    $getScopedFn(fnName: string): SprogScopedFn {
      const sprogFn = sprogFuncs[fnName as keyof typeof sprogFuncs]
      const thisScope = this as SuperScope

      if (!sprogFn) throw new Error(`Sprog doesn't have function ${fnName}`)

      return sprogFn(thisScope)
    },
    run(definition: SprogItemDefinition): Promise<any | void> {
      const sprogFn = sprogFuncs[definition.$exp]
      const params = omitObj(definition, '$exp')
      const thisScope = this as SuperScope

      if (!sprogFn) throw new Error(`Sprog doesn't have function ${definition.$exp}`)

      return sprogFn(thisScope)(params)
    }
  }
}
