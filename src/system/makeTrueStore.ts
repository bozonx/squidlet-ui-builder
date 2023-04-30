import {Readable, readable} from 'svelte/store';


export interface TrueStore extends Readable<any> {
  init: (initialData: any) => (() => void)
  getData: () => any
  setData: (newData: any) => void
  $$destroyStore: () => void
  $$onStoreInstancesChange: (cb: (instanceCount: number) => void) => void
}


export function makeTrueStore(): TrueStore {
  let initialized = false
  // TODO: а можно ли использовать undefined???
  let data: any = null
  let setValue: (data: any) => void

  const store = readable(data, (set) => {
    setValue = set
  })

  return {
    subscribe: store.subscribe,
    init: (initialData: any) => {
      const destroyInstance = () => {
        // TODO: add
      }

      if (initialized) return destroyInstance

      data = initialData
      initialized = true

      return destroyInstance
    },
    getData: (): any => {
      return data
    },
    setData: (newData: any) => {
      setValue(newData)
    },
    $$destroyStore: () => {
      // TODO: add destroy full store
    },
    $$onStoreInstancesChange: (cb: (instanceCount: number) => void) => {
      // TODO: call each time on add or remove instance
    }
  }
}
