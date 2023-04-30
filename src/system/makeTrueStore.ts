import {Readable, readable} from 'svelte/store';


export interface TrueStore extends Readable<any> {
  init: (initialData: any) => (() => void)
  getData: () => any
  setData: (newData: any) => void
  $$destroyStore: () => void
  $$onStoreInstancesChange: (cb: (instanceCount: number) => void) => void
}


export function makeTrueStore(): TrueStore {
  let lastInstanceId: number = -1
  const instances: Record<string, number> = {}
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
      lastInstanceId++

      const instanceId = lastInstanceId

      instances[instanceId] = instanceId

      const destroyInstance = () => {
        delete instances[instanceId]

        if (Object.keys(instances).length === 0) {
          // TODO: поднять свой дестрой
        }
      }

      if (initialized) return destroyInstance

      initialized = true
      data = initialData

      setValue(data)

      return destroyInstance
    },
    getData: (): any => {
      return data
    },
    setData: (newData: any) => {
      data = newData

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
