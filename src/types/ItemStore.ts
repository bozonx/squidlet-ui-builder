import {Readable} from 'svelte/store';


export interface ItemStoreData<Data = any> {
  data: Data
  initialized: boolean
  pending: boolean
  updateId: number
}

export interface ItemStore<Data = any> extends Readable<Data> {

  $$setValue(value: Data): void
}
