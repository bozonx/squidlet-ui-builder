import {
  ComponentSchema,
  ComponentType,
  ElementType,
  TemplateItem,
  TextType,
} from '../../types/ComponentSchema';

export function makeComponent(schema: ComponentSchema): string {
  const props = makeComponentProps(schema.props);
  let scriptBody = '';
  let result = '';

  if (props) {
    scriptBody += props;
  }

  if (scriptBody) {
    result += `<script setup>\n${scriptBody}</script>\n`;
  }

  if (schema.template?.length) {
    result += `<template>${makeTemplateItems(schema.template)}</template>`;
  }

  return result;
}

function makeTemplateItems(items: TemplateItem[]): string {
  let result = '';

  for (const item of items) {
    if (item.type === 'Element') {
      result += '\n' + makeTemplateItemElement(item as ElementType);
    } else if (item.type === 'Text') {
      result += '\n' + makeTemplateItemText(item as TextType);
    } else if (item.type === 'Component') {
      result += '\n' + makeTemplateItemComponent(item as ComponentType);
    }
  }

  return result;
}

function makeTemplateItemComponent(item: ComponentType): string {
  const props = makeTemplateItemProps(item.props);
  const children = item.children?.length
    ? makeTemplateItems(item.children) + '\n'
    : '';

  return `<${item.component}${props}>${children}\n</${item.component}>\n`;
}

function makeTemplateItemElement(item: ElementType): string {
  const props = makeTemplateItemProps(item.props);
  const children = item.children?.length
    ? makeTemplateItems(item.children)
    : '';

  return `<${item.tag}${props}>${children}\n</${item.tag}>\n`;
}

function makeTemplateItemText(item: TextType): string {
  return item.text;
}

function makeTemplateItemProps(props: Record<string, any> | undefined): string {
  if (!props) return '';

  const result = [];

  for (const key in props) {
    const prop = props[key];

    if (prop.type === 'vprog') {
      result.push(`:${key}="${prop.value}"`);
    } else if (prop.type === 'expression') {
      result.push(`${key}="${prop.value}"`);
    } else if (prop.type === 'string') {
      result.push(`${key}="${prop.value}"`);
    }
  }

  return ' ' + result.join(' ');
}

function makeComponentProps(props: Record<string, any> | undefined): string {
  if (!props) return '';

  let result = 'const props = defineProps({\n';

  for (const key in props) {
    const prop = props[key];

    // TODO: add more types
    if (prop.type === 'vprog') {
      result += `${key}: ${prop.value},\n`;
    } else if (prop.type === 'expression') {
      result += `${key}: ${prop.value},\n`;
    } else if (prop.type === 'string') {
      result += `${key}: String,\n`;
    }
  }

  return result + '})\n';
}
