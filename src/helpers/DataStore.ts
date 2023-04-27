import { readable, Readable } from 'svelte/store';


/**
 * It is unique instance for component
 */
export class DataStore<T = any> {
  data: Readable<T | null>

  /**
   * True if the first value was set
   */
  get initiated(): boolean {
    return Boolean(this.updateCount)
  }

  get updateId(): number {
    return this.updateCount
  }

  private setValue!: (data: T | null) => void
  private updateCount: number = 0


  constructor() {
    this.data = readable<T | null>(null, (set) => {
      this.setValue = set
    })
  }


  async destroy() {
    // TODO: наверное вызвать дестрой который передан в конструктор
  }


  /**
   * It has to be set only via data adapter on first load or update
   */
  $$setValue(data: T) {
    this.updateCount++
    this.setValue(data)
  }

}
