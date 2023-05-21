import {IndexedEvents} from 'squidlet-lib';
import {SuperStruct} from '../types/SuperStruct.js';
import {SuperArray} from '../types/SuperArray.js';
import {SuperScope} from '../scope.js';


export type SuperChangeHandler = (
  // link to element which is changed. It can be a parent or its child
  target: SuperStruct | SuperArray,
  // path to child element which is changed. If '' then it is parent
  path: string
) => void


export function isSuperValue(val: any): boolean {
  return typeof val === 'object' && val.superValue
}


export class SuperValueBase {
  readonly superValue = true
  protected changeEvent = new IndexedEvents<SuperChangeHandler>()
  protected inited: boolean = false
  protected scope: SuperScope


  get isInitialized(): boolean {
    return this.inited
  }


  constructor(scope: SuperScope) {
    this.scope = scope
  }


  destroy() {
    this.changeEvent.destroy()
  }


  subscribe(handler: SuperChangeHandler): number {
    return this.changeEvent.addListener(handler)
  }

  unsubscribe(handlerIndex: number) {
    this.changeEvent.removeListener(handlerIndex)
  }

}
