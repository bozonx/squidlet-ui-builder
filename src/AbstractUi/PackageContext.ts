import {Logger} from 'squidlet-lib'
import {Main} from './Main.js';


export class PackageContext {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  setRouter() {
    this.main.setRouter()
  }

  setLogger(logger: Logger) {
    this.main.setLogger(logger)
  }

  registerComponentsLib(components: Record<string, string>) {
    this.main.componentsManager.registerComponentsLib(components)
  }

}