import {makeUniqId} from 'squidlet-lib';
import {Main} from './Main.js';
import {COMPONENT_ID_BYTES_NUM, ELEMENT_ID_BYTES_NUM} from './interfaces/constants.js';
import {ComponentBase, ComponentDefinition} from './ComponentBase.js';


export class Component extends ComponentBase {
  readonly isRoot: boolean = false
  readonly id: string
  readonly uiElId: string
  // undefined means root
  readonly parent: Component


  constructor(
    main: Main,
    parent: Component,
    componentDefinition: ComponentDefinition,
    propsValues?: Record<string, any>
  ) {
    super(main, componentDefinition, propsValues)

    this.id = makeUniqId(COMPONENT_ID_BYTES_NUM)
    this.uiElId = makeUniqId(ELEMENT_ID_BYTES_NUM)
    this.parent = parent
  }

}
