import {mergeDeepObjects} from 'squidlet-lib';
import {CommonComponent, ComponentData, ComponentResource} from '../../types/CommonComponent.js';
import {loadPrjYamlFile} from '../buildHelpers.js';
import {ROOT_DIRS, SVELTE_EXT, YAML_EXT} from '../../types/constants.js';
import {BuilderMain} from '../BuilderMain.js';
import {SchemaItem} from '../../types/SchemaItem.js';
import {makeValueCorrespondingType} from '../../system/helpers/common.js';


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

    const imports = this.makeAllImports(this.component.imports)

    return imports + '\n\n' + result
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

  // TODO: review
  private async makeResourcesAndDataCode(
    resources: Record<string, ComponentResource>,
    data?: Record<string, ComponentData>
  ): Promise<string> {
    let result = ''
    const fullRes = await this.prepareResource(resources)

    result += this.makeResourcesStr(fullRes)

    if (data) {
      for (const dataName of Object.keys(data)) {
        const dt = data[dataName]
        const method = dt.method || fullRes[dt.resource].method
        const params = (dt.params) ? JSON.stringify(dt.params) : ''

        if (!method) throw new Error(`Can't resolve method of resource "${dt.resource}"`)

        result += `const ${dataName} = resources.${dt.resource}.${method}(${params})\n`
      }
    }

    return result
  }

  private makeCombined(combined: Record<string, string>): string {
    return Object.keys(combined)
      .map((name: string) => `$: ${name} = ${combined[name]}`)
      .join('\n')
  }

  private makeAllImports(imports?: string[]): string {
    const allImports = [
      ...imports || [],
      ...this.importStrings,
      ...(this.component.tmpl) ? this.makeImportsStrFromTemplate(this.component.tmpl) : [],
    ]

    return allImports.join('\n')
  }

  /**
   * Make import strings from template
   */
  private makeImportsStrFromTemplate(tmpl: string): string[] {
    let result: string[] = []

    for (const cmpName of this.main.prjComponentNames) {
      if (tmpl.indexOf('<' + cmpName) === -1) continue

      result.push(`import ${cmpName} from '@/${ROOT_DIRS.components}/${cmpName}${SVELTE_EXT}'`)
    }

    for (const libPrefix of Object.keys(this.main.libsComponentNames)) {
      for (const cmpName of this.main.libsComponentNames[libPrefix]) {
        const cmpFullName = libPrefix + cmpName

        if (tmpl.indexOf('<' + cmpFullName) === -1) continue

        const cmpPath = `@/${ROOT_DIRS.componentLibs}/${libPrefix}/${cmpName}${SVELTE_EXT}`

        result.push(`import ${cmpFullName} from '${cmpPath}'`)
      }
    }

    return result
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

      // TODO: удалить параметр tmpl

      fullRes[resourceName] = mergeDeepObjects(rawResources[resourceName], tmlObj)
    }

    return fullRes
  }

  private makeResourcesStr(fullRes: Record<string, ComponentResource>): string {
    let result = `const resources = {\n`

    for (const resourceName of Object.keys(fullRes)) {
      const res = fullRes[resourceName]
      const cfg = (res.config) ? JSON.stringify(res.config) : ''

      this.registerImport(`import {instantiateAdapter} from "@/${ROOT_DIRS.system}"`)

      result += `  localFiles: instantiateAdapter("${res.adapter}", ${cfg}),\n`
    }

    result += '}\n\n'

    return result
  }

}
