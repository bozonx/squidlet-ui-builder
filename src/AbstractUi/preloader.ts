import yaml from 'yaml';
import {ComponentDefinition} from './Component.js';
import {ROOT_COMPONENT_ID, RootComponentDefinition} from './RootComponent.js';


const INCLUDE_STATEMENT = '@include:'


/**
 * Loads all the components which are imported in root component and other components.
 * And return {pathToFileRelativeRootComponent: ComponentDefinition}
 */
export async function preloader(
  rootComponentYamlPath: string,
  loader: (pathTo: string) => Promise<string>
): Promise<Record<string, ComponentDefinition>> {
  const rootCmpDefStr = await loader(rootComponentYamlPath)
  const rootCompRawDef: Record<string, any> = yaml.parse(rootCmpDefStr)
  const rootCompDef = await recursiveInclude(
    rootCompRawDef,
    loader
  ) as RootComponentDefinition

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


async function recursiveInclude(
  currentObj: Record<string, any>,
  loader: (pathTo: string) => Promise<string>
): Promise<Record<string, any>> {
  for (const itemName of Object.keys(currentObj)) {
    if (
      typeof currentObj[itemName] !== 'string'
      || currentObj[itemName].indexOf(INCLUDE_STATEMENT) !== 0
    ) continue

    const filePath = currentObj[itemName].split(INCLUDE_STATEMENT)[1]
    let fileContentStr: string

    try {
      fileContentStr = await loader(filePath)
    }
    catch (e) {
      throw new Error(`Can't include yaml file "${filePath}": ${e}`)
    }

    let jsContent: any

    try {
      jsContent = yaml.parse(fileContentStr)
    }
    catch (e) {
      throw new Error(`Can't parse yaml file "${filePath}": ${e}`)
    }

    // TODO: в этом include тоже может быть include

    currentObj[itemName] = jsContent
  }

  return currentObj
}
