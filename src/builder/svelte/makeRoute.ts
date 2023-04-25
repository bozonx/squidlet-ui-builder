import path from 'node:path';
import {ROOT_DIRS} from '../../types/constants.js';
import {BuilderMain} from '../BuilderMain.js';
import {applyTemplate, loadYamlFile} from '../../helpers/common.js';
import {RouteComponent} from '../../types/RouteComponent.js';


export async function makeRouteContent(main: BuilderMain, fileName: string): Promise<string> {
  const component: RouteComponent = await loadYamlFile(main, ROOT_DIRS.routes, fileName)

  return await applyTemplate(
    path.join(__dirname, 'svelteComponentTmpl.txt'),
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
