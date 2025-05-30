import { ComponentSchema } from '../../types/ComponentSchema';
import { makeTemplateItems } from './makeTemplateItem';

export function makeComponent(schema: ComponentSchema): string {
  const props = makeComponentProps(schema.props);
  const handlers = makeComponentHandlers(schema.handlers);
  let scriptBody = '';
  let result = [];

  if (props) {
    scriptBody += props;
  }

  if (handlers) {
    scriptBody += handlers;
  }

  if (scriptBody) {
    result.push(`<script setup>\n${scriptBody}</script>`);
  }

  if (schema.template?.length) {
    result.push(
      `<template>\n${makeTemplateItems(schema.template)}\n</template>`
    );
  }

  if (schema.styleScoped) {
    result.push(`<style scoped>\n${schema.styleScoped}\n</style>`);
  }

  if (schema.style) {
    result.push(`<style>\n${schema.style}\n</style>`);
  }

  return result.join('\n\n');
}

function makeComponentProps(props: Record<string, any> | undefined): string {
  if (!props) return '';

  let result = 'const props = defineProps({\n';

  for (const key in props) {
    const prop = props[key];

    if (
      ['expression', 'boolean', 'number', 'array', 'object'].includes(prop.type)
    ) {
      result += `${key}: ${prop.value},\n`;
    } else if (prop.type === 'string') {
      result += `${key}: String,\n`;
    }
  }

  return result + '})\n';
}

function makeComponentHandlers(
  handlers: Record<string, any> | undefined
): string {
  if (!handlers) return '';

  let result = [];

  for (const key in handlers) {
    const handler = handlers[key];

    if (!handler) continue;

    // TODO: parse to AST and make vue expression

    result.push(`const ${key} = ${handler.trim()};`);
  }

  return result.join('\n');
}