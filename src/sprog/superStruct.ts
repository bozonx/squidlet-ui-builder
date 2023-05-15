import {IndexedEvents, objGet, objSetMutate} from 'squidlet-lib';


// TODO: поддержка валидации по типу

interface SuperStrucDefinitionBase {
  // TODO: get normal props
  type: 'string' | 'number'
  default?: any
}

interface SuperStrucDefinitionExtra {
  required: boolean
  readonly: boolean
}

export type SuperStructInitDefinition = SuperStrucDefinitionBase & Partial<SuperStrucDefinitionExtra>
export type SuperStructDefinition = SuperStrucDefinitionBase & SuperStrucDefinitionExtra


/*
 * Struct which can be changed from anywhere
 */

export function initSuperStruct() {

}

export function superStructGet() {

}

export function superStructSet() {

}


export class SuperStruct<T> {
  // It assumes that you will not change it
  readonly definition: Record<string, SuperStructDefinition> = {}
  readonly changeEvent = new IndexedEvents<() => void>()

  private value: Record<any, any> = {}


  constructor(definition: Record<string, SuperStructInitDefinition>, defaultRo: boolean = false) {

    // TODO: do it deeply ???

    for (const name of Object.keys(definition)) {
      this.definition[name] = {
        ...definition[name],
        required: Boolean(definition[name].required),
        readonly: (defaultRo)
          ? definition[name].readonly !== false
          : Boolean(definition[name].readonly),
      }
    }
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

  /**
   * It make full deep clone. You can change it
   */
  clone(): T {

    // TODO: make deep clone

    return this.value
  }

}
