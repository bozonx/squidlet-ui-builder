import {BuilderMain} from './BuilderMain.js';


export class Output {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  async init() {
    // TODO: make build dir if need
  }


  async write(fileName: string, dir: string, content: string) {
    // TODO: write to build dir
  }

}
