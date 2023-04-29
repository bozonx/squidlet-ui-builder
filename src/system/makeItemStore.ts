import {ItemStore, ItemStoreData} from '../types/ItemStore.js';
import {TrueStore} from './makeTrueStore.js';


export function makeItemStore (trueStore: TrueStore, initialValue: any): ItemStore {
  const destroyInstance = trueStore.init({
    data: initialValue,
    initialized: false,
    pending: true,
    updateId: 0,
  } as ItemStoreData)

  return {
    subscribe: trueStore.subscribe,
    $$setPending(pending: boolean) {
      trueStore.setData({ ...trueStore.getData(), pending })
    },
    $$setValue(value: any) {
      const newData: ItemStoreData = {
        ...trueStore.getData(),
        data: value,
        initialized: true,
        updateId: trueStore.getData().updateId + 1,
      }

      if (!trueStore.getData().initialized) newData.pending = false

      trueStore.setData(newData)
    },
    destroy() {
      destroyInstance()
    }
  }
}
