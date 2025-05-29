import { Translator } from "@/types/Translator"
import { makeComponent } from "./makeComponent"
import { ComponentSchema } from "@/types/ComponentSchema"
import { RouterFile } from '@/types/RouterFile';
import { makeRouter } from "./makeRouter";

export default {
  makeComponent: (component: ComponentSchema) => {
    return makeComponent(component);
  },

  makeRouter: (routerFile: RouterFile) => {
    return makeRouter(routerFile);
  },
};