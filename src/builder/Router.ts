import {BuilderMain} from './BuilderMain.js';

export class Router {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  async makeJs(): Promise<string> {

  }

}
