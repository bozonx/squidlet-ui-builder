import {Document} from './Document.js';
import {MainSection} from './MainSection.js';
import {SideMenu} from './SideMenu.js';
import {VerticalMenu} from './VerticalMenu.js';
import {NestedMenu} from './NestedMenu.js';
import {ButtonGroup} from '../goodUi/ButtonGroup.js';
import {Link} from './Link.js';
import {ForEach} from './ForEach.js';
import {RenderComponent} from './RenderComponent.js';
import {Router} from '../router/Router.js';


export const STD_COMPONENTS: Record<string, string> = {
  // Very basic
  Document,
  RenderComponent,
  ForEach,
  Router,
  // Ui stdLib
  MainSection,
  SideMenu,
  VerticalMenu,
  NestedMenu,
  ButtonGroup,
  Link,
}
