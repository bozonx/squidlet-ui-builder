import {PackageContext} from '../PackageContext.js';
import {GOOD_UI} from './index.js';


export function goodUiPlugin() {
  return (context: PackageContext) => {
    context.registerComponentsLib('goodUi', GOOD_UI)
  }
}
