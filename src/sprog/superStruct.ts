import {IndexedEvents, objGet, objSetMutate} from 'squidlet-lib';


// TODO: поддержка валидации по типу


export interface SuperStructDefinition {
  // TODO: get normal props
  type: 'string' | 'number'
  default?: any
  required?: boolean
  readonly?: boolean
}


/*
 * Struct which can be changed from anywhere
 */

export function superStruct() {

}


export class SuperStruct<T> {
  // It assumes that you will not change it
  readonly definition: Record<string, SuperStructDefinition>
  readonly changeEvent = new IndexedEvents<() => void>()

  private value: Record<any, any> = {}


  /**
   * It assumes that you will not change it
   */
  get struct(): T {
    return this.value
  }


  constructor(definition: Record<string, SuperStructDefinition>, fullRo: boolean = false) {

    // TODO: если fullRo - то проставить всем readonly deeply

    this.definition = definition
  }

  /**
   * Init with initial values.
   * It returns setter for readonly params
   */
  init(initialValues?: Record<string, any>): ((pathTo: string, newValue: any) => void) {
    if (initialValues) {
      // TODO: валидировать
      this.value = initialValues
    }

    return (pathTo: string, newValue: any) => {
      objSetMutate(this.value, pathTo, newValue)

      this.changeEvent.emit()
    }
  }

  destroy() {
    this.changeEvent.destroy()
  }


  getValue(pathTo: string): any {
    return objGet(this.value, pathTo)
  }

  setValue(pathTo: string, newValue: any) {
    // TODO: проверить если readonly то ошибка
    // TODO: если нет определения deeply то ошибка

    objSetMutate(this.value, pathTo, newValue)

    this.changeEvent.emit()
  }

  resetValue(pathTo: string) {
    // TODO: проверить если readonly то ошибка
    // TODO: если нет определения deeply то ошибка

    objSetMutate(this.value, pathTo, null)

    this.changeEvent.emit()
  }

  subscribe(handler: () => void): number {
    return this.changeEvent.addListener(handler)
  }

  unsubscribe(handlerIndex: number) {
    this.changeEvent.removeListener(handlerIndex)
  }

}
