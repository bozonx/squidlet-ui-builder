import {Main} from './Main.js';
import {Component, ComponentDefinition} from './Component.js';
import {SuperStruct} from '../sprog/index.js';
import {SlotsDefinition} from './ComponentSlotsManager.js';
import {ScreenDefinition} from './router/Screen.js';


export interface RootComponentDefinition extends ComponentDefinition {
  components?: ComponentDefinition[]
  screens?: ScreenDefinition[]
}


export const ROOT_COMPONENT_ID = 'root'


export class RootComponent extends Component {
  readonly isRoot: boolean = true
  readonly id = ROOT_COMPONENT_ID
  //readonly uiElId = ROOT_COMPONENT_ID


  constructor(main: Main, componentDefinition: ComponentDefinition) {
    const slots: SlotsDefinition = {
      // TODO: правильно ???
      default: componentDefinition.tmpl
    }
    // TODO: не очень хорошо так делать
    const parent = null as any

    super(main, parent, componentDefinition, slots, new SuperStruct({}))
  }


  protected makeId(): string {
    return ROOT_COMPONENT_ID
  }

}
