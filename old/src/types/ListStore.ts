import {Readable} from 'svelte/store';


export interface ListStoreData<Item = any> {
  data: Item[]
  initialized: boolean
  pending: boolean
  removed: boolean
  updateId: number
  totalCount: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ListStore<Item = any> extends Readable<Item[]> {
  $$setPending(pending: boolean): void
  $$setRemoved(removed: boolean): void
  $$setValue(value: Item[], hasNext: boolean, hasPrev: boolean, totalCount: number): void
  destroy(): void
}
