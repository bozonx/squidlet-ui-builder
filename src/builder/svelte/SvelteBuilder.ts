import {FrameworkBuilder} from '../../types/FrameworkBuilder.js';
import {LayoutComponent} from '../../types/LayoutComponent.js';
import {ScreenComponent} from '../../types/ScreenComponent.js';
import {CommonComponent} from '../../types/CommonComponent.js';
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
        CODE: this.makeImportsStr(layout.tmpl) + '\n' +
          this.makeProps(layout.props) + '\n' +
          this.makeState(layout.state) + '\n',
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
        CODE: this.makeImportsStr(screen.tmpl) + '\n\n' +
          this.makeProps(screen.props) + '\n\n' +
          this.makeState(screen.state) + '\n\n',
        TEMPLATE: screen.tmpl,
        STYLES: screen.styles,
      }
    )
  }

  buildComponent = async (component: CommonComponent): Promise<string> => {
    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        CODE: this.makeImportsStr(component.tmpl) + '\n' +
          this.makeProps(component.props) + '\n' +
          this.makeState(component.state) + '\n',
        TEMPLATE: component.tmpl,
        STYLES: component.styles,
      }
    )
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

  private makeProps(props?: Record<string, SchemaItem>): string {
    if (!props) return ''

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

  private makeState(state?: Record<string, SchemaItem>): string {
    if (!state) return ''

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

}
