import {SchemaItem} from './SchemaItem.js';


export interface ComponentResource {
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
