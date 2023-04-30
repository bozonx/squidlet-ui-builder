import {Readable, readable} from 'svelte/store'


export interface TrueStore extends Readable<any> {
  init: (initialData: any) => (() => void)
  getData: () => any
  setData: (newData: any) => void
  $$destroyStore: () => void
  $$onStoreInstancesChange: (cb: (instanceCount: number) => void) => void
}


export function makeTrueStore(): TrueStore {
  let lastInstanceId: number = -1
  let instances: Record<string, number> = {}
  let initialized = false
  let instanceCountChangeCb: ((instanceCount: number) => void) | undefined
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
      // it has to be called on instance destroy
      const destroyInstance = () => {
        delete instances[instanceId]

        if (instanceCountChangeCb) instanceCountChangeCb(Object.keys(instances).length)
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
      lastInstanceId = -1
      instances = {}
      initialized = false
      instanceCountChangeCb = undefined
      data = null

      setValue(null)
    },
    $$onStoreInstancesChange: (cb: (instanceCount: number) => void) => {
      instanceCountChangeCb = cb
    }
  }
}
