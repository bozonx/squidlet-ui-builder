import path from 'node:path';
import {fileURLToPath} from 'url';
import {FrameworkBuilder} from '../../types/FrameworkBuilder.js';
import {LayoutComponent} from '../../types/LayoutComponent.js';
import {ScreenComponent} from '../../types/ScreenComponent.js';
import {CommonComponent} from '../../types/CommonComponent.js';
import {BuilderMain} from '../BuilderMain.js';
import {applyTemplate} from '../../helpers/common.js';
import {BuildComponent} from './BuildComponent.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class SvelteBuilder implements FrameworkBuilder {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  buildLayout = async (layout: LayoutComponent): Promise<string> => {
    const buildComponent = new BuildComponent(this.main, layout)

    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        CODE: await buildComponent.buildCode(),
        TEMPLATE: layout.tmpl,
        STYLES: layout.styles,
      }
    )
  }

  buildScreen = async (screen: ScreenComponent): Promise<string> => {
    const buildComponent = new BuildComponent(this.main, screen)

    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        CODE: await buildComponent.buildCode(),
        TEMPLATE: screen.tmpl,
        STYLES: screen.styles,
      }
    )
  }

  buildComponent = async (component: CommonComponent): Promise<string> => {
    const buildComponent = new BuildComponent(this.main, component)

    return await applyTemplate(
      path.join(__dirname, './svelteComponentTmpl.txt'),
      {
        CODE: await buildComponent.buildCode(),
        TEMPLATE: component.tmpl,
        STYLES: component.styles,
      }
    )
  }

}
