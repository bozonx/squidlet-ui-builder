import yaml from 'yaml';
import {ComponentDefinition} from './interfaces/ComponentDefinition.js';
import {ELEMENT_TYPES} from './ElementTypes.js';
import {UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';
import {AnyElement} from './interfaces/AnyElement.js';


export async function render(rootUiFile: string, fileLoader: (fileName: string) => Promise<string>) {
  const rootComponentDefinition = yaml.parse(rootUiFile)
  const rootComponent = aliveComponent(rootComponentDefinition)

  console.log(1111, rootComponent)
}


// TODO: надо оживить компонент
function aliveComponent(componentDefinition: ComponentDefinition): AnyElement {
  const rootTmplElement: UiElementDefinitionBase = componentDefinition.tmpl
  const type = rootTmplElement.type

  return new ELEMENT_TYPES[type](rootTmplElement)
}
