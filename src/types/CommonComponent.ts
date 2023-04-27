import {SchemaItem} from './SchemaItem.js';


export const RESOURCE_CLASSES = {
  item: 'ItemResource',
  list: 'ListResource',
}

export type ResourceType = 'item' | 'list'

export interface ComponentResource {
  type: ResourceType
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
  tmpl?: string
  styles?: string
}
