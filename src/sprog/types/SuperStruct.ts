import {cloneDeepObject, deepGet, deepSet} from 'squidlet-lib';
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
      return target.getValue(p)
    },

    has(target: SuperStruct, p: string): boolean {
      return target.has(p)
    },

    set(target: SuperStruct, p: string, newValue: any): boolean {
      target.setValue(p, newValue)

      return true
    },

    deleteProperty(target: SuperStruct, p: string): boolean {
      throw new Error(`It isn't possible to delete struct value`)
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


export class SuperStruct<T = Record<string, AllTypes>> extends SuperValueBase {
  // It assumes that you will not change it
  readonly definition: Record<keyof T, SuperStructDefinition> = {} as any
  // current values
  readonly values = {} as T


  constructor(
    scope: SuperScope,
    definition: Record<keyof T, SuperStructInitDefinition>,
    defaultRo: boolean = false
  ) {
    super(scope)

    this.definition = this.prepareDefinition(definition, defaultRo)
  }

  /**
   * Init with initial values.
   * It returns setter for readonly params
   */
  init(initialValues?: T): ((name: keyof T, newValue: AllTypes) => void) {

    // TODO: надо получить key от родителя

    if (this.inited) {
      throw new Error(`The struct has been already initialized`)
    }

    if (initialValues) {
      for (const key of Object.keys(initialValues)) {
        const keyName = key as keyof T
        this.safeSetOwnValue(keyName, initialValues[keyName] as any)
        // start listen for child changes
        // TODO: может проверить это в definition ???
        if (isSuperValue(this.values[keyName])) {

          // TODO: надо установить parent
          // TODO: надо инициализировать - передать значения

          // TODO: не обязательно это слушать, события можно поднимать и через set
          //(this.values[keyName] as SuperValueBase).subscribe(this.handleChildChange)
        }
      }
    }
    // check required values
    for (const keyStr of Object.keys(this.definition)) {
      const keyName = keyStr as keyof T
      if (this.definition[keyName].required && typeof this.values[keyName] === 'undefined') {
        throw new Error(`The value ${keyStr} is required, but it wasn't initiated`)
      }
    }
    // means that struct is completely initiated
    this.inited = true
    // rise an event any way if any values was set or not
    this.riseMyChangeEvent()

    return this.roSetter
  }

  destroy() {
    super.destroy()

    for (const key of Object.keys(this.values as any)) {
      const keyName = key as keyof T
      if (isSuperValue(this.values[keyName])) (this.values[keyName] as SuperValueBase).destroy()
    }
  }


  has(pathTo: string): boolean {
    return Boolean(this.getValue(pathTo))
  }

  getValue(pathTo: string): AllTypes | undefined {
    return deepGet(this.values as any, pathTo)
  }

  setValue(pathTo: string, newValue: AllTypes) {
    this.justSetValue(pathTo, newValue)

    // TODO: rise change event
    //this.riseMyChangeEvent(name)
  }

  resetValue(pathTo: string) {
    this.justSetValue(pathTo, null)

    // TODO: rise change event
  }

  /**
   * It make full deep clone.
   * You can change it but changes will not affect the struct.
   */
  clone(): T {
    return cloneDeepObject(this.values as any)
  }

  link() {
    // TODO: прилинковать значения разных struct, array или primitive
    //       чтобы эти значения менялись одновременно
  }


  /**
   * Set value of self readonly value and rise an event
   */
  private roSetter = (name: keyof T, newValue: any) => {
    this.safeSetOwnValue(name, newValue, true)
    this.riseMyChangeEvent(name)
  }

  /**
   * Set value deeply but do not rise an event
   */
  private justSetValue(pathTo: string, value: AllTypes) {
    if (pathTo.indexOf('.') === -1) {
      // own value
      this.safeSetOwnValue(pathTo as keyof T, value)
    }
    else {
      // deep value
      deepSet(this.values as any, pathTo, value)
    }
  }

  private safeSetOwnValue(name: keyof T, value: AllTypes, ignoreRo: boolean = false) {
    if (typeof this.definition[name] === 'undefined') {
      throw new Error(
        `Can't set value with name ${String(name)} which isn't defined in definition`
      )
    }
    else if (this.definition[name].readonly) {
      throw new Error(`Can't set readonly value of name ${String(name)}`)
    }

    // TODO: check type

    this.values[name] = value as any
  }

  private riseMyChangeEvent(key?: keyof T) {
    let fullPath: string | undefined = key as string

    if (this.myPath && key) {
      fullPath = this.myPath + '.' + String(key)
    }
    else if (this.myPath) {
      fullPath = this.myPath
    }

    this.changeEvent.emit(this, fullPath)
  }

  private handleChildChange = (target: SuperStruct | SuperArray, childPath: string) => {
    const fullPath = (this.myPath) ? this.myPath + '.' + childPath : childPath

    this.changeEvent.emit(target, fullPath)
  }

  private prepareDefinition(
    definition: Record<keyof T, SuperStructInitDefinition>,
    defaultRo: boolean
  ): Record<keyof T, SuperStructDefinition> {
    const res: Record<keyof T, SuperStructDefinition> = {} as any

    for (const keyStr of Object.keys(definition)) {
      const keyName = keyStr as keyof T
      res[keyName] = {
        ...definition[keyName],
        required: Boolean(definition[keyName].required),
        readonly: (defaultRo)
          ? definition[keyName].readonly !== false
          : Boolean(definition[keyName].readonly),
      }
    }

    return res
  }

}
