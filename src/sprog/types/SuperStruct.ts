import {cloneDeepObject} from 'squidlet-lib';
import {SuperScope} from '../scope.js';
import {AllTypes} from './valueTypes.js';
import {SuperValueBase, isSuperValue} from '../lib/SuperValueBase.js';
import {SuperArray} from './SuperArray.js';


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


export class SuperStruct<T = Record<any, any>> extends SuperValueBase {
  // It assumes that you will not change it
  readonly definition: Record<string, SuperStructDefinition> = {}
  // current values
  readonly values: Record<any, any> = {}


  constructor(
    scope: SuperScope,
    definition: Record<string, SuperStructInitDefinition>,
    defaultRo: boolean = false
  ) {
    super(scope)

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
        this.safeSetValue(name, initialValues[name])
        // start listen for child changes
        if (isSuperValue(this.values[name])) {
          (this.values[name] as SuperValueBase).changeEvent
            .addListener(this.handleChildChange)
        }
      }
    }
    // check required values
    for (const name of Object.keys(this.definition)) {
      if (this.definition[name].required && typeof this.values[name] === 'undefined') {
        throw new Error(`The value ${name} is required, but it wasn't initiated`)
      }
    }
    // means that struct is completely initiated
    this.inited = true
    // rise an event any way if any values was set or not
    this.changeEvent.emit(this, '')

    return this.roSetter
  }

  destroy() {
    super.destroy()

    for (const name of Object.keys(this.values)) {
      if (isSuperValue(this.values[name])) (this.values[name] as SuperValueBase).destroy()
    }
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
    return cloneDeepObject(this.values)
  }

  link() {
    // TODO: прилинковать значения разных struct, array или primitive
    //       чтобы эти значения менялись одновременно
  }


  private roSetter = (pathTo: string, newValue: any) => {
    // TODO: если нет определения deeply то ошибка
    // TODO: поддержка валидации по типу

    objSetMutate(this.value, pathTo, newValue)

    this.changeEvent.emit()
  }

  private safeSetValue(name: string, value: any) {

    // TODO: check type
    // TODO: check readonly

    this.values[name] = value
  }

  private handleChildChange = (target: SuperStruct | SuperArray, path: string) => {

    // TODO: нужно к path добавить своё имя

    this.changeEvent.emit(target, path)
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
