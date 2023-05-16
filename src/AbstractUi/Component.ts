import {makeUniqId} from 'squidlet-lib';
import {Main} from './Main.js';
import {COMPONENT_ID_BYTES_NUM, ELEMENT_ID_BYTES_NUM} from './interfaces/constants.js';
import {ComponentBase, ComponentDefinition} from './ComponentBase.js';
import {RootComponent} from './RootComponent.js';
import {SuperStruct} from '../sprog/superStruct.js';
import {SlotsDefinition} from './ComponentSlotsManager.js';


export class Component extends ComponentBase {
  readonly isRoot: boolean = false
  readonly id: string
  readonly uiElId: string
  readonly parent: Component | RootComponent


  constructor(
    main: Main,
    parent: Component | RootComponent,
    componentDefinition: ComponentDefinition,
    slotsDefinition: SlotsDefinition,
    incomeProps: SuperStruct
  ) {
    super(main, componentDefinition, slotsDefinition, incomeProps)

    this.id = makeUniqId(COMPONENT_ID_BYTES_NUM)
    this.uiElId = makeUniqId(ELEMENT_ID_BYTES_NUM)
    this.parent = parent
  }

}
