import {Readable} from 'svelte/store';


export interface ItemStoreData<Data = any> {
  data: Data
  initialized: boolean
  pending: boolean
  removed: boolean
  updateId: number
}

export interface ItemStore<Data = any> extends Readable<Data> {
  $$setPending(pending: boolean): void
  $$setRemoved(removed: boolean): void
  $$setValue(value: Data): void
  destroy(): void
}
