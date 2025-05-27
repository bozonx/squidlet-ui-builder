import {Files} from './Files.ts';


export class SquidletFrontend {
  userFiles: Files

  constructor() {
    this.userFiles = new Files()
  }

}
