import {BuilderMain} from './BuilderMain.js';
import {loadYamlFile} from '../helpers/common.js';
import {FILE_NAMES, ROOT_DIRS, YAML_EXT} from '../types/constants.js';

export class MakeRouter {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  async makeJs(): Promise<string> {
    const obj = await loadYamlFile(
      this.main,
      ROOT_DIRS.app,
      FILE_NAMES.router + YAML_EXT
    )


  }

}
