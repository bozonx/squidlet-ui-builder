import {BuilderMain} from './BuilderMain.js';
import {loadYamlFile} from '../helpers/common.js';
import {FILE_NAMES, ROOT_DIRS, YAML_EXT} from '../types/constants.js';
import {RoutesFile} from '../types/RoutesFile.js';


// TODO: наверное лучше переделать в просто ф-ю

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

    for (const route of routesFile.routes) {
      if (route.layout) {
        layouts[route.layout] = route.layout
      }

      screens[route.component] = route.component
    }

    const importsString = this.makeImportsString(Object.keys(layouts), Object.keys(screens))
    const routesArrString = this.makeRoutesArrString(routesFile)
    let result = ''

    result += importsString
    result += '\n\n'
    result += 'export const routes = ' + routesArrString

    return result
  }


  private makeImportsString(layouts: string[], screens: string[]): string {
    let importsString = ''

    for (const layoutClassName of layouts) {
      importsString += `import ${layoutClassName} from '../${ROOT_DIRS.layouts}/${layoutClassName}.svelte'\n`
    }

    for (const screenClassName of screens) {
      importsString += `import ${screenClassName} from '../${ROOT_DIRS.screens}/${screenClassName}.svelte'\n`
    }

    return importsString
  }

  private makeRoutesArrString(routesFile: RoutesFile): string {
    let routesJsonStr = JSON.stringify(routesFile.routes, null, 2)

    // TODO: replace не очень решение - лучше пройтись по элементам и вставить в них !!
    routesJsonStr = routesJsonStr
      .replace(/("component": )"([\w\d_$]+)"/g, '$1$2')
    routesJsonStr = routesJsonStr
      .replace(/("layout": )"([\w\d_$]+)"/g, '$1$2')

    return routesJsonStr
  }

}
