import path from 'node:path';
import {fileURLToPath} from 'url';
import {ROOT_DIRS} from '../../types/constants.js';
import {BuilderMain} from '../BuilderMain.js';
import {applyTemplate, loadYamlFile} from '../../helpers/common.js';
import {ScreenComponent} from '../../types/ScreenComponent.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function makeLayoutContent(main: BuilderMain, fileName: string): Promise<string> {
  const component: ScreenComponent = await loadYamlFile(main, ROOT_DIRS.screens, fileName)


  return await applyTemplate(
    path.join(__dirname, './svelteComponentTmpl.txt'),
    {
      // TODO: add code
      // TODO: use layout
      CODE: '',
      TEMPLATE: component.tmpl,
      STYLES: component.styles,
    }
  )
  // TODO: формируем файл маршрута
  // TODO: если встречаем зависимые компоненты то подгружаем их в объект компонентов
  // TODO: компонента формируем 1 раз и далее уже его не трогаем если ещё раз встречается
  // TODO: так же с ресурсами - подключаем только 1 раз
}
