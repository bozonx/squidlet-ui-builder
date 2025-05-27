import {ItemStore, ItemStoreData} from '../types/ItemStore.js';
import {TrueStore} from './makeTrueStore.js';


/**
 * This is store to use during component lifecycle which is uses it
 * @param trueStore - store which is uses for several per component stories
 * @param initialValue - initial value witch will be used only at first time
 */
export function makeItemStore (trueStore: TrueStore, initialValue: any = null): ItemStore {
  const destroyInstance = trueStore.init({
    data: initialValue,
    initialized: false,
    pending: true,
    removed: false,
    updateId: 0,
  } as ItemStoreData)

  return {
    subscribe: trueStore.subscribe,
    // this is called only by adapter
    $$setPending(pending: boolean) {
      trueStore.setData({ ...trueStore.getData(), pending })
    },
    // this is called only by adapter
    $$setRemoved(removed: boolean) {
      trueStore.setData({ ...trueStore.getData(), removed })
    },
    // this is called only by adapter
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
