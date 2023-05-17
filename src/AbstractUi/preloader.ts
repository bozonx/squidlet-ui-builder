import yaml from 'yaml';
import {ComponentDefinition} from './Component.js';
import {ROOT_COMPONENT_ID, RootComponentDefinition} from './RootComponent.js';


/**
 * Loads all the components which are imported in root component and other components.
 * And return {pathToFileRelativeRootComponent: ComponentDefinition}
 */
export async function preloader(
  rootComponentYamlPath: string,
  loader: (pathTo: string) => Promise<string>
): Promise<Record<string, ComponentDefinition>> {
  const rootCmpDefStr = await loader(rootComponentYamlPath)
  const rootCompDef: RootComponentDefinition = yaml.parse(rootCmpDefStr)


  // TODO: find all the @include:



  let res = {
    [ROOT_COMPONENT_ID]: rootCompDef
    // TODO: add other components - get from root
  }

  if (rootCompDef.components) {
    res = {
      ...res,
      ...rootCompDef.components,
    }

    delete rootCompDef.components
  }

  if (rootCompDef.screens) {
    res = {
      ...res,
      ...rootCompDef.screens,
    }

    delete rootCompDef.screens
  }

  return res
}
