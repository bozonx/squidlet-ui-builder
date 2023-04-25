import {BuilderMain} from './BuilderMain.js';


export class Output {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  async write(fileName: string, dir: string, content: string) {
    // TODO: write to build dir
  }

}
