import {IndexedEvents, objSetMutate, cloneDeepObject} from 'squidlet-lib';
import {values} from 'lodash';


/*
 * Struct which can be changed from anywhere
 */


// TODO: проще использовать proxy


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


export function initSuperStruct() {

}

export function superStructGet() {

}

export function superStructSet() {

}


export class SuperStruct<T = Record<any, any>> {
  // It assumes that you will not change it
  readonly definition: Record<string, SuperStructDefinition> = {}
  readonly changeEvent = new IndexedEvents<() => void>()
  // current values
  private value: Record<any, any> = {}
  private inited: boolean = false


  get isInitialized(): boolean {
    return this.inited
  }


  constructor(definition: Record<string, SuperStructInitDefinition>, defaultRo: boolean = false) {
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
    if (this.inited) {
      throw new Error(`The struct has been already initialized`)
    }

    if (initialValues) {
      for (const name of Object.keys(initialValues)) {
        this.justSetValue(name, initialValues[name])
      }
    }

    this.inited = true

    return this.justSetValue
  }

  destroy() {
    this.changeEvent.destroy()
  }


  has(pathTo: string): boolean {

    // TODO: deep

    return Boolean(this.value[pathTo])
  }

  getValue(pathTo: string): any {

    // TODO: если глубокий путь то
    //       * если обычный объект то взять его значение
    //       * обычный массив то взять его значение
    //       * struct - вызвать getValue и идти дальше
    //       * superArray - вызвать getValue и идти дальше

    return this.value[pathTo]

    //return objGet(this.value, pathTo)
  }

  setValue(pathTo: string, newValue: any) {
    // TODO: проверить если readonly то ошибка
    // TODO: если глубокий путь ???

    this.justSetValue(pathTo, newValue)
  }

  resetValue(pathTo: string) {
    // TODO: проверить если readonly то ошибка
    // TODO: если глубокий путь ???

    this.justSetValue(pathTo, null)
  }

  subscribe(handler: () => void): number {
    return this.changeEvent.addListener(handler)
  }

  unsubscribe(handlerIndex: number) {
    this.changeEvent.removeListener(handlerIndex)
  }

  /**
   * It make full deep clone.
   * You can change it but changes will not affect the struct.
   */
  clone(): T {
    return cloneDeepObject(this.value)
  }


  private justSetValue = (pathTo: string, newValue: any) => {
    // TODO: если нет определения deeply то ошибка
    // TODO: поддержка валидации по типу

    objSetMutate(this.value, pathTo, newValue)

    this.changeEvent.emit()
  }

}
