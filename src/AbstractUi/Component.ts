import {makeUniqId} from 'squidlet-lib';
import {Main} from './Main.js';
import {COMPONENT_ID_BYTES_NUM, ELEMENT_ID_BYTES_NUM} from './interfaces/constants.js';
import {ComponentBase, ComponentDefinition} from './ComponentBase.js';
import {RootComponent} from './RootComponent.js';


export class Component extends ComponentBase {
  readonly isRoot: boolean = false
  readonly id: string
  readonly uiElId: string
  // undefined means root
  readonly parent: Component | RootComponent


  constructor(
    main: Main,
    parent: Component | RootComponent,
    componentDefinition: ComponentDefinition,
    propsValues?: Record<string, any>
  ) {
    super(main, componentDefinition, propsValues)

    this.id = makeUniqId(COMPONENT_ID_BYTES_NUM)
    this.uiElId = makeUniqId(ELEMENT_ID_BYTES_NUM)
    this.parent = parent
  }

}
