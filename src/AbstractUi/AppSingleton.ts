import {Main} from './Main.js';


export class AppSingleton {
  private readonly main: Main


  // TODO: сделать по нормальному
  router = {
    toPath: (p: Record<any, any>) => {
      console.log(777, p)
    }
  }


  constructor(main: Main) {
    this.main = main
  }



}
