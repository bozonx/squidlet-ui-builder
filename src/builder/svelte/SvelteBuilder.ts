import {FrameworkBuilder} from '../../types/FrameworkBuilder.js';
import {LayoutComponent} from '../../types/LayoutComponent.js';
import {ScreenComponent} from '../../types/ScreenComponent.js';
import {CommonComponent} from '../../types/CommonComponent.js';
import {BuilderMain} from '../BuilderMain.js';
import {applyTemplate} from '../../helpers/common.js';
import path from 'node:path';
import {fileURLToPath} from 'url';
import {ROOT_DIRS, SVELTE_EXT} from '../../types/constants.js';


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
        CODE: this.makeImportsStr(layout.tmpl) + '\n',
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
        CODE: this.makeImportsStr(screen.tmpl) + '\n',
        TEMPLATE: screen.tmpl,
        STYLES: screen.styles,
      }
    )
  }

  buildComponent = async (component: CommonComponent): Promise<string> => {
    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        CODE: this.makeImportsStr(component.tmpl) + '\n',
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

    return imports
  }

}
