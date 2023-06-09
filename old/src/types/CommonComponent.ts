import {SchemaItem} from './SchemaItem.ts';


// export const RESOURCE_CLASSES = {
//   item: 'ItemResource',
//   list: 'ListResource',
// }
//
// export type ResourceType = 'item' | 'list'

export interface ComponentResource {
  //type: ResourceType
  adapter: string
  method?: string
  tmpl?: string
  config?: Record<string, any>
}

export interface ComponentData {
  resource: string
  // TODO: что должно быть???
  schema: any
  params?: Record<string, any>
  method?: string
}

export interface CommonComponent {
  imports?: string[]
  props?: Record<string, SchemaItem>
  state?: Record<string, SchemaItem>
  resources?: Record<string, ComponentResource>
  data?: Record<string, ComponentData>
  // code inside component script
  onInit?: string
  // obj {vv: 'a + 1'} ===> $: vv: a + 1
  combined?: Record<string, string>
  tmpl?: string
  styles?: string
}
