export type SchemaItemType = 'any' | 'number' | 'string' | 'boolean' | 'null' | 'array' | 'object'


/**
 * Schema item for props, state, stores etc
 */
export interface SchemaItem {
  type: SchemaItemType
  required?: boolean
  default?: string | number | null | any[] | Record<string, any>
  // TODO: add min, max, validate (for custom validate)
}
