import {SquidletFrontend} from '../../squidlet-frontend';


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
