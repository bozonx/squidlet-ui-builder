import { ComponentSchema } from './ComponentSchema';
import { RouterFile } from './RouterFile';

export interface Translator {
  makeComponent: (component: ComponentSchema) => string;
  makeRouter: (routerFile: RouterFile) => string;
}
