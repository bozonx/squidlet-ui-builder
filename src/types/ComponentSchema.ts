export type TemplateItem =
  | ComponentType
  | ElementType
  | TextType
  | IfType
  | ElseType
  | IfElseType
  | ForType
  | RouterViewType
  | RouterLinkType
  | SlotType
  | ExpressionType;

export interface ComponentSchema {
  props?: Record<string, Props>;
  template?: TemplateItem[];
}

// TODO: add directives : v-show, if else, foreach, etc

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
  type: 'Component';
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
  value: string;
}

export interface IfType {
  type: 'If';
  condition: string;
  children: TemplateItem[];
}

export interface ElseType {
  type: 'Else';
  children: TemplateItem[];
}

export interface IfElseType {
  type: 'IfElse';
  condition: string;
  children: TemplateItem[];
}

export interface ForType {
  type: 'For';
  array?: string;
  object?: string;
  item?: string;
  key?: string;
  children: TemplateItem[];
}

export interface RouterViewType {
  type: 'RouterView';
  name: string;
  //children: TemplateItem[];
}

export interface RouterLinkType {
  type: 'RouterLink';
  to: string;
  props?: Record<string, any>;
  children: TemplateItem[];
}

export interface SlotType {
  type: 'Slot';
  name: string;
  children: TemplateItem[];
}

export interface ExpressionType {
  type: 'Expression';
  value: string;
}
