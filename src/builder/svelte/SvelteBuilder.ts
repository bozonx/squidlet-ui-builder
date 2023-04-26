import {FrameworkBuilder} from '../../types/FrameworkBuilder.js';
import {LayoutComponent} from '../../types/LayoutComponent.js';
import {ScreenComponent} from '../../types/ScreenComponent.js';
import {CommonComponent} from '../../types/CommonComponent.js';
import {BuilderMain} from '../BuilderMain.js';
import {applyTemplate} from '../../helpers/common.js';
import path from 'node:path';


export class SvelteBuilder implements FrameworkBuilder {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  async buildLayout(layout: LayoutComponent): Promise<string> {
    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        // TODO: add code
        // TODO: use layout
        CODE: '',
        TEMPLATE: layout.tmpl,
        STYLES: layout.styles,
      }
    )
    // TODO: формируем файл маршрута
    // TODO: если встречаем зависимые компоненты то подгружаем их в объект компонентов
    // TODO: компонента формируем 1 раз и далее уже его не трогаем если ещё раз встречается
    // TODO: так же с ресурсами - подключаем только 1 раз
  }

  async buildScreen(screen: ScreenComponent): Promise<string> {
    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        // TODO: add code
        // TODO: use layout
        CODE: '',
        TEMPLATE: screen.tmpl,
        STYLES: screen.styles,
      }
    )
    // TODO: формируем файл маршрута
    // TODO: если встречаем зависимые компоненты то подгружаем их в объект компонентов
    // TODO: компонента формируем 1 раз и далее уже его не трогаем если ещё раз встречается
    // TODO: так же с ресурсами - подключаем только 1 раз
  }

  async buildComponent(component: CommonComponent): Promise<string> {
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
}
