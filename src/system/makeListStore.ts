import {readable} from 'svelte/store';
import {ListStore, ListStoreData} from '../types/ListStore.js';


export function makeListStore (initialValue: any[]): ListStore {
  let data: ListStoreData = {
    data: initialValue,
    initialized: false,
    pending: true,
    updateId: 0,
  }
  let setValue: (data: ListStoreData) => void

  const store = readable(data, (set) => {
    setValue = set
  })

  return {
    subscribe: store.subscribe,
    $$setPending(pending: boolean) {
      setValue({
        ...data,
        pending,
      })
    },
    $$setValue(value: any) {
      const newDate: ListStoreData = {
        ...data,
        data: value,
        initialized: true,
        updateId: data.updateId + 1,
      }

      if (!data.initialized) newDate.pending = false

      setValue(newDate)
    },
  }
}
