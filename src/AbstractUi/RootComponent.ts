import {Main} from './Main.js';
import {ComponentBase, ComponentDefinition} from './ComponentBase.js';
import {SuperStruct} from '../sprog/superStruct.js';
import {SlotsDefinition} from './ComponentSlotsManager.js';


export const ROOT_COMPONENT_ID = 'root'


export class RootComponent extends ComponentBase {
  readonly isRoot: boolean = true
  readonly id = ROOT_COMPONENT_ID
  readonly uiElId = ROOT_COMPONENT_ID


  constructor(main: Main, componentDefinition: ComponentDefinition) {
    const slots: SlotsDefinition = {
      // TODO: правильно ???
      default: componentDefinition.tmpl
    }

    super(main, componentDefinition, slots, new SuperStruct({}))
  }


  async init() {
    await super.init()

    // TODO: а чё всмысле ???
    // render root component
    await this.mount('/', 0)
  }

  async destroy() {
    await super.destroy()
    // TODO: послать событие на unmount корня
    // TODO: дестрой всех компонентов

  }

}
