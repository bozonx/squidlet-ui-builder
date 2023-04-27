import {mergeDeepObjects} from 'squidlet-lib';
import {CommonComponent, ComponentData, ComponentResource, RESOURCE_CLASSES} from '../../types/CommonComponent.js';
import {loadPrjYamlFile, makeValueCorrespondingType} from '../../helpers/common.js';
import {CODE_EXT, ROOT_DIRS, SVELTE_EXT, YAML_EXT} from '../../types/constants.js';
import {BuilderMain} from '../BuilderMain.js';
import {SchemaItem} from '../../types/SchemaItem.js';


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

    if (this.component.tmpl) result += this.makeImportsStr(this.component.tmpl) + '\n'
    if (this.component.props) result += this.makeProps(this.component.props) + '\n'
    if (this.component.state) result += this.makeState(this.component.state) + '\n'
    if (this.component.resources) result += await this.makeResourcesAndDataCode(
      this.component.resources,
      this.component.data
    ) + '\n'

    return this.makeExtImports(this.component.imports) + '\n\n' + result
  }

  private makeExtImports(imports?: string[]): string {
    const allImports = [
      ...imports || [],
      ...this.importStrings,
    ]

    return allImports.join('\n')
  }

  private makeImportsStr(tmpl: string): string {
    let imports = ''

    for (const cmpName of this.main.prjComponentNames) {
      if (tmpl.indexOf('<' + cmpName) === -1) continue

      imports += `import ${cmpName} from '../${ROOT_DIRS.components}/${cmpName}${SVELTE_EXT}'\n`
    }

    for (const libPrefix of Object.keys(this.main.libsComponentNames)) {
      for (const cmpName of this.main.libsComponentNames[libPrefix]) {
        const cmpFullName = libPrefix + cmpName

        if (tmpl.indexOf('<' + cmpFullName) === -1) continue

        const cmpPath = `../${ROOT_DIRS.componentLibs}/${libPrefix}/${cmpName}${SVELTE_EXT}`

        imports += `import ${cmpFullName} from '${cmpPath}'\n`
      }
    }

    return imports
  }

  private makeProps(props: Record<string, SchemaItem>): string {
    let result = ''

    for (const propName of Object.keys(props)) {
      if (typeof props[propName].default === 'undefined') {
        result += `export let ${propName}`
      }
      else {
        result += `export let ${propName} = ${makeValueCorrespondingType(props[propName].type, props[propName].default)}`
      }
    }

    return result
  }

  private makeState(state: Record<string, SchemaItem>): string {
    let result = ''

    for (const propName of Object.keys(state)) {
      if (typeof state[propName].default === 'undefined') {
        result += `let ${propName}`
      }
      else {
        result += `let ${propName} = ${makeValueCorrespondingType(state[propName].type, state[propName].default)}`
      }
    }

    return result
  }

  private async makeResourcesAndDataCode(
    resources: Record<string, ComponentResource>,
    data?: Record<string, ComponentData>
  ): Promise<string> {
    let result = ''

    const fullRes: Record<string, ComponentResource> = { ...resources }
    // load resoutce templates
    for (const resourceName of Object.keys(resources)) {
      if (!resources[resourceName].tmpl) continue

      const tmlObj: ComponentResource = await loadPrjYamlFile(
        this.main,
        ROOT_DIRS.resourcesTmpl,
        resources[resourceName].tmpl + YAML_EXT
      )

      fullRes[resourceName] = mergeDeepObjects(tmlObj, resources[resourceName])
    }

    result += `const resources = {\n`

    for (const resourceName of Object.keys(fullRes)) {
      const res = fullRes[resourceName]

      const cfg = (res.config) ? JSON.stringify(res.config) : ''
      const resClass = RESOURCE_CLASSES[res.type]

      this.registerImport(`import ${resClass} from "../lib/${resClass + CODE_EXT}"`)

      result += `  localFiles: new ${resClass}(${res.adapter}, ${cfg}),\n`
    }

    result += '}\n\n'

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


  private registerImport(importStr: string) {
    this.importStrings.push(importStr)
  }

}
