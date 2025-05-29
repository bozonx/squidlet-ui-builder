import { ComponentSchema } from '../../types/ComponentSchema';
import { makeTemplateItems } from './makeTemplateItem';

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
