import {ListStore, ListStoreData} from '../types/ListStore.js';
import {TrueStore} from './makeTrueStore.js';


export function makeListStore (trueStore: TrueStore, initialValue: any[]): ListStore<any> {
  const destroyInstance = trueStore.init({
    data: initialValue,
    initialized: false,
    pending: true,
    removed: false,
    updateId: 0,
    hasNext: false,
    hasPrev: false,
    totalCount: 0,
  } as ListStoreData)

  return {
    subscribe: trueStore.subscribe,
    $$setPending(pending: boolean) {
      trueStore.setData({ ...trueStore.getData(), pending })
    },
    $$setRemoved(removed: boolean) {
      trueStore.setData({ ...trueStore.getData(), removed })
    },
    $$setValue(value: any[], hasNext: boolean, hasPrev: boolean, totalCount: number) {
      const newData: ListStoreData = {
        ...trueStore.getData(),
        data: value,
        initialized: true,
        updateId: trueStore.getData().updateId + 1,
        hasNext,
        hasPrev,
        totalCount,
      }

      if (!trueStore.getData().initialized) newData.pending = false

      trueStore.setData(newData)
    },
    destroy() {
      destroyInstance()
    }
  }
}
