import {PackageContext} from '../PackageContext.js';
import {ROUTER_COMPONENT} from './index.js';


export function routerPlugin() {
  return (context: PackageContext) => {
    context.registerComponentsLib('goodUi', ROUTER_COMPONENT)
  }
}
