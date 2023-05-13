import {ComponentDefinition} from './interfaces/ComponentDefinition.js';
import yaml from 'yaml';


export async function render(rootUiFile: string, fileLoader: (fileName: string) => Promise<string>) {
  const rootComponentDefinition = yaml.parse(rootUiFile)
  const rootComponent = aliveComponent(rootComponentDefinition)


}


function aliveComponent(componentDefinition: ComponentDefinition) {
  console.log(1111, componentDefinition)
}
