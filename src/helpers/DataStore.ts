import { readable, Readable } from 'svelte/store';


/**
 * It is unique instance for component
 */
export class DataStore<T = any> {
  data: Readable<T | null>

  /**
   * True if the first value was set
   */
  initiated = readable(false, (set) => {
    this.setInitiated = set
  })

  updateId = readable(0, (set) => {
    this.setUpdateId = set
  })

  private setValue!: (data: T | null) => void
  private setInitiated!: (data: boolean) => void
  private setUpdateId!: (data: number) => void
  // TODO: может сразу использвать updateId
  private updateCount: number = 0
  private destroyState: () => Promise<void>


  constructor(destroyState: () => Promise<void>) {
    this.destroyState = destroyState
    this.data = readable<T | null>(null, (set) => {
      this.setValue = set
    })
  }


  async destroy() {
    await this.destroyState()
    // @ts-ignore
    delete this.destroyState
    // @ts-ignore
    delete this.data
  }


  /**
   * It has to be set only via data adapter on first load or update
   */
  $$setValue(data: T) {
    if (this.updateCount === 0) {
      this.setInitiated(true)
    }

    this.updateCount++

    this.setUpdateId(this.updateCount)
    this.setValue(data)
  }

}
