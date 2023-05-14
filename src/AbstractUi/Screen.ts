import {Document} from './elements/Document.js';
import {Window} from './Window';
import {UiState} from './UiState';
import {ScreenDefinition} from './interfaces/ScreenDefinition';


export class Screen {
  readonly document = new Document()
  readonly state = new UiState()

  private readonly window!: Window


  constructor(definition: () => ScreenDefinition) {
    // TODO: use definition
  }

  async init(window: Window) {
    //this.window = window
    await this.document.init()

    // TODO: должен поднять событие что его надо отрендерить
  }

  async destroy() {
    await this.document.destroy()
  }

}
