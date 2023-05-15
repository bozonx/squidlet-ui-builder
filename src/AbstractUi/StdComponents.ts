import {Document} from './stdLib/Document.js';
import {MainSection} from './stdLib/MainSection.js';
import {SideMenu} from './stdLib/SideMenu.js';
import {VerticalMenu} from './stdLib/VerticalMenu.js';
import {NestedMenu} from './stdLib/NestedMenu.js';
import {ButtonGroup} from './stdLib/ButtonGroup.js';
import {Link} from './stdLib/Link.js';
import {ForEach} from './stdLib/ForEach.js';
import {RenderComponent} from './stdLib/RenderComponent.js';
import {Router} from './router/Router.js';


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
