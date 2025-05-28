export interface ComponentSchema {
  props?: Record<string, any>
  template: TemplateItem[]
}

export interface TemplateItem {
  // TODO: add more types
  type: 'Component' | 'Text' | 'If' | 'Else' | 'IfElse' | 'ForEach'
  component: string
  props?: Record<string, any>
  children?: TemplateItem[]
}