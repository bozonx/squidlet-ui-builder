import {Document} from './elements/Document.js';
import {MainSection} from './elements/MainSection.js';
import {SideMenu} from './elements/SideMenu.js';
import {VerticalMenu} from './elements/VerticalMenu.js';
import {NestedMenu} from './elements/NestedMenu.js';
import {ButtonGroup} from './elements/ButtonGroup.js';
import {Link} from './elements/Link.js';
import {ForEach} from './elements/ForEach.js';
import {RenderComponent} from './elements/RenderComponent.js';
import {Router} from './router/Router.js';


export const STD_COMPONENTS: Record<string, string> = {
  // Very basic
  Document,
  RenderComponent,
  ForEach,
  Router,
  // Ui elements
  MainSection,
  SideMenu,
  VerticalMenu,
  NestedMenu,
  ButtonGroup,
  Link,
}
