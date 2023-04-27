import {FrameworkBuilder} from '../../types/FrameworkBuilder.js';
import {LayoutComponent} from '../../types/LayoutComponent.js';
import {ScreenComponent} from '../../types/ScreenComponent.js';
import {CommonComponent, ComponentData, ComponentResource, RESOURCE_CLASSES} from '../../types/CommonComponent.js';
import {BuilderMain} from '../BuilderMain.js';
import {applyTemplate, makeValueCorrespondingType} from '../../helpers/common.js';
import path from 'node:path';
import {fileURLToPath} from 'url';
import {ROOT_DIRS, SVELTE_EXT} from '../../types/constants.js';
import {SchemaItem} from '../../types/SchemaItem.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class SvelteBuilder implements FrameworkBuilder {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  buildLayout = async (layout: LayoutComponent): Promise<string> => {
    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        CODE: await this.makeCode(layout),
        TEMPLATE: layout.tmpl,
        STYLES: layout.styles,
      }
    )
    // TODO: если встречаем зависимые компоненты то подгружаем их в объект компонентов
    // TODO: компонента формируем 1 раз и далее уже его не трогаем если ещё раз встречается
    // TODO: так же с ресурсами - подключаем только 1 раз
  }

  buildScreen = async (screen: ScreenComponent): Promise<string> => {
    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        CODE: await this.makeCode(screen),
        TEMPLATE: screen.tmpl,
        STYLES: screen.styles,
      }
    )
  }

  buildComponent = async (component: CommonComponent): Promise<string> => {
    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        CODE: await this.makeCode(component),
        TEMPLATE: component.tmpl,
        STYLES: component.styles,
      }
    )
  }


  private async makeCode(component: CommonComponent): Promise<string> {
    let result = ''

    // TODO: собрать все импорты воедино

    if (component.imports) result += this.makeExtImports(component.imports) + '\n'
    if (component.tmpl) result += this.makeImportsStr(component.tmpl) + '\n'
    if (component.props) result += this.makeProps(component.props) + '\n'
    if (component.state) result += this.makeState(component.state) + '\n'
    if (component.resources) result += await this.makeResourcesAndDataCode(
      component.resources,
      component.data
    ) + '\n'

    return result
  }

  private makeExtImports(imports: string[]): string {
    return imports.map((el) => el + '\n').join('')
  }

  private makeImportsStr(tmpl: string): string {
    let imports = ''

    for (const cmpName of this.main.prjComponentNames) {
      if (tmpl.indexOf('<' + cmpName) === -1) continue

      imports += `import ${cmpName} from '../${ROOT_DIRS.components}/${cmpName}${SVELTE_EXT}'\n`
    }

    for (const libPrefix of Object.keys(this.main.libsComponentNames)) {
      for (const cmpName of this.main.libsComponentNames[libPrefix]) {
        const cmpFullName = libPrefix + cmpName

        if (tmpl.indexOf('<' + cmpFullName) === -1) continue

        const cmpPath = `../${ROOT_DIRS.componentLibs}/${libPrefix}/${cmpName}${SVELTE_EXT}`

        imports += `import ${cmpFullName} from '${cmpPath}'\n`
      }
    }

    return imports
  }

  private makeProps(props: Record<string, SchemaItem>): string {
    let result = ''

    for (const propName of Object.keys(props)) {
      if (typeof props[propName].default === 'undefined') {
        result += `export let ${propName}`
      }
      else {
        result += `export let ${propName} = ${makeValueCorrespondingType(props[propName].type, props[propName].default)}`
      }
    }

    return result
  }

  private makeState(state: Record<string, SchemaItem>): string {
    let result = ''

    for (const propName of Object.keys(state)) {
      if (typeof state[propName].default === 'undefined') {
        result += `let ${propName}`
      }
      else {
        result += `let ${propName} = ${makeValueCorrespondingType(state[propName].type, state[propName].default)}`
      }
    }

    return result
  }

  private async makeResourcesAndDataCode(
    resources: Record<string, ComponentResource>,
    data?: Record<string, ComponentData>
  ): Promise<string> {
    let result = ''
    const fullResources = {
      // TODO: подгрузить темплейт ресурса
    }

    result += `const resources = {\n`

    for (const resourceName of Object.keys(resources)) {
      const res = resources[resourceName]
      const cfg = (res.config) ? JSON.stringify(res.config) : ''
      const resClass = RESOURCE_CLASSES[res.type]

      // TODO: подгрузить Resource ???

      result += `  localFiles: new ${resClass}(${res.adapter}, ${cfg}),\n`
    }

    result += '}\n\n'

    if (data) {
      for (const dataName of Object.keys(data)) {
        const dt = data[dataName]
        const method = dt.method || resources[dt.resource].method
        const params = (dt.params) ? JSON.stringify(dt.params) : ''

        if (!method) throw new Error(`Can't resolve method of resource "${dt.resource}"`)

        result += `const ${dataName} = resources.${dt.resource}.${method}(${params})\n`
      }
    }

    return result
  }

}
