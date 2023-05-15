

import {Component} from '../Component.js';
import {Main} from '../Main.js';
import {RootComponent} from '../RootComponent.js';
import {ComponentBase, ComponentDefinition} from '../ComponentBase.js';


export class Screen extends ComponentBase {
  readonly isScreen: boolean = true


  constructor(
    main: Main,

    // TODO: parent - router
    parent: Component | RootComponent,
    componentDefinition: ComponentDefinition,
  ) {
    super(main, componentDefinition)
  }

}
