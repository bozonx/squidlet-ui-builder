import yaml from 'yaml';
import {Component, ComponentDefinition} from './Component.js';


export async function render(rootUiFile: string, fileLoader: (fileName: string) => Promise<string>) {
  const rootComponentDefinition = yaml.parse(rootUiFile)
  const rootComponent = aliveComponent(rootComponentDefinition)

  console.log(1111, rootComponent)
}


function aliveComponent(componentDefinition: ComponentDefinition): Component {
  return new Component(componentDefinition)
}
