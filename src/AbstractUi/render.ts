import yaml from 'yaml';
import {Component, ComponentDefinition} from './Component.js';
import {Main} from './Main.js';


export async function render(
  main: Main,
  rootUiFile: string,
  fileLoader: (fileName: string) => Promise<string>
) {
  const rootComponentDefinition: ComponentDefinition = yaml.parse(rootUiFile)

  // TODO: когда ипользовать fileLoader?? - сразу всё подгрузить или по мере необходимости?

  const rootComponent = new Component(main, rootComponentDefinition)

  await rootComponent.init()
}
