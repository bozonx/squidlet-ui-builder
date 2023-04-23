import { dev } from '$app/environment';
import {SquidletFrontend} from '../../squidlet-frontend';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;


export async function load(params: any) {
  console.log(111, params)
  // TODO: инстанс надо затулить в какой-то синглтон
  const squidletFronend = new SquidletFrontend()
  const menuScreens = squidletFronend.userFiles.instantiateStringFile('menu/screensMenu')
  const menuComponents = squidletFronend.userFiles.instantiateStringFile('menu/components')

  return {
    menuScreens: menuScreens.getJsonContent(),
    menuComponents: menuComponents.getJsonContent(),
  }
}
