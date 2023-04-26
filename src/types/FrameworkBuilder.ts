import {LayoutComponent} from './LayoutComponent.js';
import {ScreenComponent} from './ScreenComponent.js';
import {CommonComponent} from './CommonComponent.js';


export interface FrameworkBuilder {
  buildLayout(obj: LayoutComponent): Promise<string>
  buildScreen(obj: ScreenComponent): Promise<string>
  buildComponent(obj: CommonComponent): Promise<string>
}
