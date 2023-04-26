import {BuilderMain} from './BuilderMain.js';
import {loadYamlFile} from '../helpers/common.js';
import {FILE_NAMES, ROOT_DIRS, YAML_EXT} from '../types/constants.js';
import {RoutesFile} from '../types/RoutesFile.js';

export class MakeRouter {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  async makeJs(): Promise<string> {
    const routesFile: RoutesFile = await loadYamlFile(
      this.main,
      ROOT_DIRS.app,
      FILE_NAMES.routes + YAML_EXT
    )

    const layouts: Record<string, any> = {}
    const screens: Record<string, any> = {}
    let importsString = ''
    let result = ''
    let routesJsonStr = JSON.stringify(routesFile.routes, null, 2)

    for (const route of routesFile.routes) {
      if (route.layout) {
        layouts[route.layout] = route.layout
      }

      screens[route.component] = route.component
    }

    for (const layoutClassName of Object.keys(layouts)) {
      importsString += `import ${layoutClassName} from '../${ROOT_DIRS.layouts}/${layoutClassName}.svelte'`
    }

    for (const screenClassName of Object.keys(screens)) {
      importsString += `import ${screenClassName} from '../${ROOT_DIRS.screens}/${screenClassName}.svelte'`
    }

    result += importsString
    result += '\n'
    result += 'export const routes = ' + routesJsonStr

    return result
  }

}
