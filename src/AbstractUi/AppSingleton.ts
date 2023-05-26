import {Main} from './Main.js';
import {RootComponent} from './RootComponent.js';


export class AppSingleton {
  private readonly main: Main
  readonly root = new RootComponent(this)


  // TODO: сделать по нормальному
  router = {
    toPath: (p: Record<any, any>) => {
      console.log(777, p)
    }
  }


  constructor(main: Main) {
    this.main = main
  }


  async init() {
    await this.root.init()
    // render root component
    await this.root.mount()
  }

  async destroy() {
    await this.root.unmount()
    await this.root.destroy()
  }


}
