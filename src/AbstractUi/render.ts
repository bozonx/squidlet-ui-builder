import yaml from 'yaml';
import {Component, ComponentDefinition} from './Component.js';


export async function render(rootUiFile: string, fileLoader: (fileName: string) => Promise<string>) {
  const rootComponentDefinition: ComponentDefinition = yaml.parse(rootUiFile)
  const rootComponent = new Component(rootComponentDefinition)

  await rootComponent.init()
}
