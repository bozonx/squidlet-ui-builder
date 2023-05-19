
/**
 * Register new var only if it doesn't exist.
 * If you don't have to chech it then better to use setJsValue
 */
export function newVar(scope: Record<string, any> = {}) {
  return async (p: {name: string, value: any}) => {
    if (Object.keys(scope).indexOf(p.name) >= 0) {
      throw new Error(`Can't reinitialize existent var ${p.name}`)
    }

    scope[p.name] = p.value
  }
}

// TODO: add deleteVar
export function deleteVar() {
  return async (p: {name: string, value: any}) => {

  }
}
