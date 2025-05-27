import {LayoutComponent} from './LayoutComponent.ts';
import {ScreenComponent} from './ScreenComponent.ts';
import {CommonComponent} from './CommonComponent.ts';


export interface FrameworkBuilder {
  buildLayout(obj: LayoutComponent): Promise<string>
  buildScreen(obj: ScreenComponent): Promise<string>
  buildComponent(obj: CommonComponent): Promise<string>
}
