import yaml from 'yaml';
import {ComponentDefinition} from './Component.js';
import {ROOT_COMPONENT_ID} from './RootComponent.js';


/**
 * Loads all the components which are imported in root component and other components.
 * And return {pathToFileRelativeRootComponent: ComponentDefinition}
 */
export async function preloader(
  rootComponentYamlPath: string,
  loader: (pathTo: string) => Promise<string>
): Promise<Record<string, ComponentDefinition>> {
  const rootCmpDefStr = await loader(rootComponentYamlPath)
  const rootCompDef: ComponentDefinition = yaml.parse(rootCmpDefStr)

  // TODO: find all the imports

  return {
    [ROOT_COMPONENT_ID]: rootCompDef
  }
}
