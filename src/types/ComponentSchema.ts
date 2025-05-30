export type TemplateItem =
  | ComponentType
  | ElementType
  | TextType
  | IfType
  | ElseType
  | ElseIfType
  | ForType
  | RouterViewType
  | RouterLinkType
  | SlotType
  | ExpressionType;

export interface ComponentSchema {
  props?: Record<string, Props>;
  state?: Record<string, any>;
  handlers?: Record<string, string>;
  template?: TemplateItem[];
  style?: string;
  styleScoped?: string;
}

export interface Props {
  type: 'expression' | 'string' | 'boolean' | 'number' | 'array' | 'object';
  value: any;
}

export interface OnEvent {
  expr: string;
}

export interface TemplateProps {
  type: 'expression' | 'string' | 'boolean' | 'number';
  value: any;
}

export interface ComponentType {
  type: 'Component';
  component: string;
  on?: Record<string, OnEvent>;
  props?: Record<string, TemplateProps>;
  children?: TemplateItem[];
}

export interface ElementType {
  type: 'Element';
  tag: string;
  on?: Record<string, OnEvent>;
  props?: Record<string, TemplateProps>;
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

export interface ElseIfType {
  type: 'ElseIf';
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
  //children: TemplateItem[];
}

export interface RouterLinkType {
  type: 'RouterLink';
  to: string;
  on?: Record<string, OnEvent>;
  props?: Record<string, TemplateProps>;
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
