import {Readable} from 'svelte/store';


export interface ListStoreData<Item = any> {
  data: Item[]
  initialized: boolean
  pending: boolean
  updateId: number
  totalCount: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ListStore<Item = any> extends Readable<Item[]> {
  $$setPending(pending: boolean): void
  $$setValue(value: Item[]): void
}
