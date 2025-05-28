export interface ComponentSchema {
  props?: Props
  template: TemplateItem[]
}

export interface TemplateItem {
  // TODO: add more types
  type: 'Component' | 'Text' | 'If' | 'Else' | 'IfElse' | 'ForEach'
  component: string
  props?: Record<string, any>
  children?: TemplateItem[]
}

export interface Props {
  type: 'vprog' | 'expression' | 'string'
  value: any
}