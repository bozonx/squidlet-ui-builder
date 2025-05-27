import {mergeDeepObjects, omitObj} from 'squidlet-lib';
import {CommonComponent, ComponentData, ComponentResource} from '../../types/CommonComponent.ts';
import {loadPrjYamlFile, makeJsObjectString} from '../buildHelpers.ts';
import {ROOT_DIRS, SVELTE_EXT, YAML_EXT} from '../../types/constants.ts';
import {BuilderMain} from '../BuilderMain.ts';
import {SchemaItem} from '../../types/SchemaItem.ts';
import {makeValueCorrespondingType} from '../../system/helpers/common.ts';


export class BuildComponent {
  private readonly main: BuilderMain
  private readonly component: CommonComponent
  private importStrings: string[] = []


  constructor(main: BuilderMain, component: CommonComponent) {
    this.main = main
    this.component = component
  }


  async buildCode(): Promise<string> {
    let result = ''

    if (this.component.props) result += this.makeProps(this.component.props) + '\n'
    if (this.component.state) result += this.makeState(this.component.state) + '\n'
    if (this.component.resources) result += await this.makeResourcesAndDataCode(
      this.component.resources,
      this.component.data
    ) + '\n'
    if (this.component.onInit) result += this.component.onInit + '\n'
    if (this.component.combined) result += this.makeCombined(this.component.combined) + '\n'

    this.collectUserComponentImports()
    this.collectCmpLibImports()

    const imports = [
      // specified in component
      ...this.component.imports || [],
      // collected imports
      ...this.importStrings,
    ]

    return imports.join('\n') + '\n\n' + result
  }


  private makeProps(props: Record<string, SchemaItem>): string {
    let result = ''

    for (const propName of Object.keys(props)) {
      if (typeof props[propName].default === 'undefined') {
        result += `export let ${propName}\n`
      }
      else {
        result += `export let ${propName} = ${makeValueCorrespondingType(props[propName].type, props[propName].default)}\n`
      }
    }

    return result
  }

  private makeState(state: Record<string, SchemaItem>): string {
    let result = ''

    for (const propName of Object.keys(state)) {
      if (typeof state[propName].default === 'undefined') {
        result += `let ${propName}\n`
      }
      else {
        result += `let ${propName} = ${makeValueCorrespondingType(state[propName].type, state[propName].default)}\n`
      }
    }

    return result
  }

  private async makeResourcesAndDataCode(
    resources: Record<string, ComponentResource>,
    data?: Record<string, ComponentData>
  ): Promise<string> {
    let result = ''
    const fullRes = await this.prepareResource(resources)

    result += this.makeResourcesStr(fullRes) + '\n'

    if (data) {
      result += this.makeDataStr(data, fullRes) + '\n'
    }

    return result
  }

  private makeCombined(combined: Record<string, string>): string {
    return Object.keys(combined)
      .map((name: string) => `$: ${name} = ${combined[name]}`)
      .join('\n')
  }

  /**
   * Collect user's components in template which has to be imported
   * @private
   */
  private collectUserComponentImports() {
    if (!this.component.tmpl) return

    for (const cmpName of this.main.prjComponentNames) {
      // TODO: плохой способ обнаружения - лучеш через hast tree
      if (this.component.tmpl.indexOf('<' + cmpName) === -1) continue

      this.registerImport(`import ${cmpName} from '@/${ROOT_DIRS.components}/${cmpName}${SVELTE_EXT}'`)
    }
  }

  /**
   * Collect imports from component libs
   */
  private collectCmpLibImports() {
    if (!this.component.tmpl) return

    for (const libPrefix of Object.keys(this.main.libsComponentNames)) {
      for (const cmpName of this.main.libsComponentNames[libPrefix]) {
        // TODO: наверное не нужен префикс
        const cmpFullName = libPrefix + cmpName

        // TODO: плохой способ обнаружения - лучеш через hast tree
        if (this.component.tmpl.indexOf('<' + cmpFullName) === -1) continue

        const cmpPath = `@/${ROOT_DIRS.componentLibs}/${libPrefix}/${cmpName}${SVELTE_EXT}`

        this.registerImport(`import ${cmpFullName} from '${cmpPath}'`)
      }
    }
  }

  private registerImport(importStr: string) {
    this.importStrings.push(importStr)
  }

  private async prepareResource(
    rawResources: Record<string, ComponentResource>
  ): Promise<Record<string, ComponentResource>> {
    const fullRes: Record<string, ComponentResource> = { ...rawResources }
    // load resource templates
    for (const resourceName of Object.keys(rawResources)) {
      if (!rawResources[resourceName].tmpl) continue

      const tmlObj: ComponentResource = await loadPrjYamlFile(
        this.main,
        ROOT_DIRS.resourcesTmpl,
        rawResources[resourceName].tmpl + YAML_EXT
      )

      fullRes[resourceName] = mergeDeepObjects(
        omitObj(rawResources[resourceName], 'tmpl'),
        tmlObj
      )
    }

    return fullRes
  }

  private makeResourcesStr(fullRes: Record<string, ComponentResource>): string {
    let result = `const resources = {\n`

    for (const resourceName of Object.keys(fullRes)) {
      const res = fullRes[resourceName]
      const cfg = (res.config) ? JSON.stringify(res.config) : ''

      this.registerImport(`import {instantiateAdapter} from "@/${ROOT_DIRS.system}"`)

      result += `  ${resourceName}: instantiateAdapter("${res.adapter}", ${cfg}),\n`
    }

    result += '}\n'

    return result
  }

  private makeDataStr(
    data: Record<string, ComponentData>,
    fullRes: Record<string, ComponentResource>
  ): string {
    let result = ''

    for (const dataName of Object.keys(data)) {
      const dt = data[dataName]
      const method = dt.method || fullRes[dt.resource].method
      const params = (dt.params) ? makeJsObjectString(dt.params) : ''

      if (!method) throw new Error(`Can't resolve method of resource "${dt.resource}"`)

      result += `const ${dataName} = resources.${dt.resource}.${method}(${params})\n`
    }

    return result
  }

}
