import {readable} from 'svelte/store';
import {ItemStore, ItemStoreData} from '../types/ItemStore.js';


export function makeItemStore (initialValue: any): ItemStore {
  let data: ItemStoreData = {
    data: initialValue,
    initialized: false,
    pending: true,
    updateId: 0,
  }
  let setValue: (data: ItemStoreData) => void

  const store = readable(data, (set) => {
    setValue = set
  })

  return {
    subscribe: store.subscribe,
    $$setPending(pending: boolean) {
      setValue({ ...data, pending })
    },
    $$setValue(value: any) {
      const newDate: ItemStoreData = {
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
