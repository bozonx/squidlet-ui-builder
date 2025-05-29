export type TemplateItem = ComponentType | ElementType | TextType;

export interface ComponentSchema {
  props?: Record<string, Props>;
  template?: TemplateItem[];
}

export interface Props {
  // TODO: add more types
  type:
    | 'vprog'
    | 'expression'
    | 'string'
    | 'boolean'
    | 'number'
    | 'array'
    | 'object';
  value: any;
}

export interface ComponentType {
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

export interface ElementType {
  type: 'Element';
  tag: string;
  props?: Record<string, any>;
  children?: TemplateItem[];
}

export interface TextType {
  type: 'Text';
  text: string;
}
