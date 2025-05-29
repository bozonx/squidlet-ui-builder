export interface ComponentSchema {
  props?: Props
  template: TemplateItem[]
}

export interface TemplateItem {
  // TODO: add more types
  type:
    | 'Component'
    | 'Element'
    | 'Text'
    | 'InlineText'
    | 'If'
    | 'Else'
    | 'IfElse'
    | 'ForEach';
  component: string;
  props?: Record<string, any>;
  children?: TemplateItem[];
}

export interface Props {
  // TODO: add more types
  type: 'vprog' | 'expression' | 'string';
  value: any;
}