import {readable} from 'svelte/store';
import {ListStore, ListStoreData} from '../types/ListStore.js';


export function makeListStore (initialValue: any[]): ListStore<any> {
  let data: ListStoreData = {
    data: initialValue,
    initialized: false,
    pending: true,
    updateId: 0,
    hasNext: false,
    hasPrev: false,
    totalCount: 0,
  }
  let setValue: (data: ListStoreData) => void

  const store = readable<any>(data, (set) => {
    setValue = set
  })

  return {
    subscribe: store.subscribe,
    $$setPending(pending: boolean) {
      setValue({ ...data, pending })
    },
    $$setValue(value: any[], hasNext: boolean, hasPrev: boolean, totalCount: number) {
      const newDate: ListStoreData = {
        ...data,
        data: value,
        initialized: true,
        updateId: data.updateId + 1,
        hasNext,
        hasPrev,
        totalCount,
      }

      if (!data.initialized) newDate.pending = false

      setValue(newDate)
    },
    destroy() {
      // TODO: add
    }
  }
}
