import {makeUniqId} from 'squidlet-lib';
import {Component} from '../Component.js';
import {Main} from '../Main.js';
import {RootComponent} from '../RootComponent.js';
import {ComponentBase, ComponentDefinition} from '../ComponentBase.js';
import {COMPONENT_ID_BYTES_NUM, ELEMENT_ID_BYTES_NUM} from '../interfaces/constants.js';


export class Screen extends ComponentBase {
  readonly isRoot: boolean = false
  readonly isScreen: boolean = true
  readonly id: string
  readonly uiElId: string
  readonly parent: Component | RootComponent


  constructor(
    main: Main,

    // TODO: parent - router
    parent: Component | RootComponent,
    componentDefinition: ComponentDefinition,
  ) {
    super(main, componentDefinition)

    this.id = makeUniqId(COMPONENT_ID_BYTES_NUM)
    this.uiElId = makeUniqId(ELEMENT_ID_BYTES_NUM)
    this.parent = parent

  }

}
