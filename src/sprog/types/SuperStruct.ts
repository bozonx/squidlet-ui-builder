import {IndexedEvents, cloneDeepObject} from 'squidlet-lib';
import {SuperScope} from '../scope.js';
import {AllTypes} from './valueTypes.js';


interface SuperStrucDefinitionBase {
  type: AllTypes
  default?: any
}

interface SuperStrucDefinitionExtra {
  required: boolean
  readonly: boolean
}

export type SuperStructInitDefinition = SuperStrucDefinitionBase & Partial<SuperStrucDefinitionExtra>
export type SuperStructDefinition = SuperStrucDefinitionBase & SuperStrucDefinitionExtra


/**
 * Wrapper for SuperStruct which allows to manipulate it as common object
 */
export function proxyStruct(struct: SuperStruct): SuperStruct {
  const handler: ProxyHandler<SuperStruct> = {
    get(target: SuperStruct, p: string) {
      return target.values[p]
    },

    has(target: SuperStruct, p: string): boolean {
      return Boolean(target.values[p])
    },

    set(target: SuperStruct, p: string, newValue: any): boolean {
      target.values[p] = newValue

      return true
    },

    deleteProperty(target: SuperStruct, p: string): boolean {
      // TODO: поидее удалять элемент нельзя, а только установит null, так как структура уже задана
      delete target.values[p]

      return true
    },

    ownKeys(target: SuperStruct): ArrayLike<string | symbol> {
      // TODO: проверить что при запросе ключей должны вернуться ключи из values
      return Object.keys(target.values)
    }

    // defineProperty?(target: T, property: string | symbol, attributes: PropertyDescriptor): boolean;
    // getOwnPropertyDescriptor?(target: T, p: string | symbol): PropertyDescriptor | undefined;
  }

  return new Proxy(struct, handler)
}


export class SuperStruct<T = Record<any, any>> {
  private scope: SuperScope
  // It assumes that you will not change it
  readonly definition: Record<string, SuperStructDefinition> = {}
  readonly changeEvent = new IndexedEvents<SuperChangeHandler>()
  // current values
  readonly values: Record<any, any> = {}

  private inited: boolean = false


  get isInitialized(): boolean {
    return this.inited
  }


  constructor(
    scope: SuperScope,
    definition: Record<string, SuperStructInitDefinition>,
    defaultRo: boolean = false
  ) {
    this.scope = scope
    this.definition = this.prepareDefinition(definition, defaultRo)
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

    // TODO: если среди значений есть SuperStruct, array, primitive
    //       то автоматом слушать их изменения чтобы поднять свои изменения

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

  private prepareDefinition(
    definition: Record<string, SuperStructInitDefinition>,
    defaultRo: boolean
  ): Record<string, SuperStructDefinition> {
    const res: Record<string, SuperStructDefinition> = {}

    for (const name of Object.keys(definition)) {
      res[name] = {
        ...definition[name],
        required: Boolean(definition[name].required),
        readonly: (defaultRo)
          ? definition[name].readonly !== false
          : Boolean(definition[name].readonly),
      }
    }

    return res
  }

}
