import path from 'node:path';
import {fileURLToPath} from 'url';
import {FrameworkBuilder} from '../../types/FrameworkBuilder.ts';
import {LayoutComponent} from '../../types/LayoutComponent.ts';
import {ScreenComponent} from '../../types/ScreenComponent.ts';
import {CommonComponent} from '../../types/CommonComponent.ts';
import {BuilderMain} from '../BuilderMain.ts';
import {applyTemplate} from '../buildHelpers.ts';
import {BuildComponent} from './BuildComponent.ts';


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
