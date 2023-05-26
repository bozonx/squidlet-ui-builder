import {Main} from './Main.js';
import {Component, ComponentDefinition} from './Component.js';
import {SuperStruct} from '../../../squidlet-sprog/src/index.js';
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


  constructor(main: Main) {
    const slots: SlotsDefinition = {
      // TODO: правильно ???
      default: componentDefinition.tmpl
    }
    // TODO: не очень хорошо так делать
    const parent = null as any

    super(main, parent, componentDefinition, slots, new SuperStruct({}))
  }


  init() {
    //, componentDefinition: ComponentDefinition
    this.componentsManager.getDefinition(ROOT_COMPONENT_ID)
  }

  protected makeId(): string {
    return ROOT_COMPONENT_ID
  }

}
