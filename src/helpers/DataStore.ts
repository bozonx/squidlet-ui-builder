import { readable, Readable } from 'svelte/store';


/**
 * It is unique instance for component
 */
export class DataStore<T = any> {
  data: Readable<T | null>
  setValue!: (data: T | null) => void


  constructor() {
    this.data = readable<T | null>(null, (set) => {
      this.setValue = set
    })
  }


}
