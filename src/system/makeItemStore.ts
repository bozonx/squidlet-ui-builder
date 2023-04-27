import {readable} from 'svelte/store';
import {ItemStore, ItemStoreData} from '../types/ItemStore.js';


export function makeItemStore (initialValue: any): ItemStore {
  const initialData: ItemStoreData = {
    data: initialValue,
    initialized: false,
    pending: true,
    updateId: 0,
  }
  let setValue: (val: any) => void

  const { subscribe } = readable(initialData, (set) => {
    setValue = set
  })

  return {
    subscribe,

    $$setValue(value: any) {
      const newDate: ItemStoreData = {
        data: value,
        initialized: true,
        pending: false,
        updateId: 0,
      }

      setValue(newDate)
    },
  }
}
