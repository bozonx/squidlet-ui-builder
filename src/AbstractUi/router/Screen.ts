import {Component, ComponentDefinition} from '../Component.js';


export interface ScreenDefinition extends ComponentDefinition {
  components: ComponentDefinition[]
  screens: ComponentDefinition[]
}


export class Screen extends Component {
  readonly isRoot: boolean = false
  readonly isScreen: boolean = true

}
