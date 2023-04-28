import {Readable} from 'svelte/store';


export interface ListStoreData<Item = any> {
  data: Item[]
  initialized: boolean
  pending: boolean
  updateId: number
}

export interface ListStore<Item = any> extends Readable<Item[]> {
  $$setPending(pending: boolean): void
  $$setValue(value: Item[]): void
}
