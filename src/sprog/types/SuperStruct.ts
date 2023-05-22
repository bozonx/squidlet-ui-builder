import {cloneDeepObject, deepGet, deepSet} from 'squidlet-lib';
import {SuperScope} from '../scope.js';
import {All_TYPES, AllTypes} from './valueTypes.js';
import {SuperValueBase, isSuperValue} from '../lib/SuperValueBase.js';
import {isCorrespondingType} from '../lib/isCorrespondingType.js';


interface SuperStrucDefinitionBase {
  type: keyof typeof All_TYPES
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
  // It assumes that you will not change it after initialization
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

    // TODO: установка default value не сработала
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

          (this.values[keyName] as SuperValueBase).subscribe(this.handleChildChange)
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

    return this.myRoSetter
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

  /**
   * You cat deeply get some primitive or other struct or super array.
   * If it is a primitive you can't change its value.
   * To change its value get its parent and set value via parent like: parent.value = 5
   */
  getValue(pathTo: string): AllTypes | undefined {
    return deepGet(this.values as any, pathTo)
  }

  /**
   * Set value deeply.
   * You can set own value or value of some deep object.
   * Even you can set value to the deepest primitive like: struct.struct.num = 5
   */
  setValue(pathTo: string, newValue: AllTypes) {
    this.smartSetValue(pathTo, newValue)
  }

  /**
   * The same as setValue but it sets null
   */
  resetValue(pathTo: string) {
    this.smartSetValue(pathTo, null)
  }

  /**
   * It makes full deep clone.
   * You can change the clone but changes will not affect the struct.
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
  private myRoSetter = (name: keyof T, newValue: any) => {
    this.safeSetOwnValue(name, newValue, true)
    this.riseMyChangeEvent(name)
  }

  /**
   * Set value for my self of deeply.
   * It emits an event only if the deep value isn't a super type
   */
  private smartSetValue(pathTo: string, value: AllTypes) {

    // TODO: нужно ставить значение примитива через родителя

    if (pathTo.indexOf('.') === -1) {
      // own value
      this.safeSetOwnValue(pathTo as keyof T, value)
    }
    else {
      // deep value
      deepSet(this.values as any, pathTo, value)
    }

    // rise an event only if it is my children and it isn't a super value
    // super value will rise an event by itself
    // // TODO: простые типы могут быть deeply
    // if (
    //   pathTo.indexOf('.') === -1
    //   typeof this.definition[pathTo] === 'undefined'
    //   && !isSuperValue(this.values[pathTo])
    // ) {
    //   this.riseMyChangeEvent(pathTo as keyof T)
    // }
  }

  private safeSetOwnValue(name: keyof T, value: AllTypes, ignoreRo: boolean = false) {
    if (typeof this.definition[name] === 'undefined') {
      throw new Error(
        `Can't set value with name ${String(name)} which isn't defined in definition`
      )
    }
    else if (!ignoreRo && this.definition[name].readonly) {
      throw new Error(`Can't set readonly value of name ${String(name)}`)
    }
    else if (!isCorrespondingType(value, this.definition[name].type)) {
      throw new Error(
        `The value ${String(name)} is not corresponding type ${this.definition[name].type}`
      )
    }

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

  private handleChildChange = (target: SuperValueBase, childPath?: string) => {
    const fullPath = (this.myPath) ? this.myPath + '.' + childPath : childPath

    // TODO: что должно происходить если изменился потомок ???
    // TODO: наверное поднять событие у себя но с данными от потомка?
    // TODO: или поднять событие у себя как будто сам изменился?

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


const a = new SuperStruct({} as any, {
  p1: {type: 'string', default: 'a'}
} as any)
const b = proxyStruct(a)

a.init({p1: 'b'})

//console.log(b.getValue('p1'))
console.log((b as any)['p1'])
