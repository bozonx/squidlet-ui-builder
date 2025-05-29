import {
  ComponentType,
  ElementType,
  ElseType,
  ForType,
  IfElseType,
  IfType,
  RouterLinkType,
  RouterViewType,
  SlotType,
  TemplateItem,
  TextType,
} from '@/types/ComponentSchema';

export function makeTemplateItems(items: TemplateItem[]): string {
  let result = [];

  for (const item of items) {
    if (item.type === 'Element') {
      result.push(makeTemplateItemElement(item as ElementType));
    } else if (item.type === 'Text') {
      result.push(makeTemplateItemText(item as TextType));
    } else if (item.type === 'Component') {
      result.push(makeTemplateItemComponent(item as ComponentType));
    } else if (item.type === 'If') {
      result.push(makeTemplateItemIf(item as IfType));
    } else if (item.type === 'Else') {
      result.push(makeTemplateItemElse(item as ElseType));
    } else if (item.type === 'IfElse') {
      result.push(makeTemplateItemIfElse(item as IfElseType));
    } else if (item.type === 'For') {
      result.push(makeTemplateItemFor(item as ForType));
    } else if (item.type === 'RouterView') {
      result.push(makeTemplateItemRouterView(item as RouterViewType));
    } else if (item.type === 'RouterLink') {
      result.push(makeTemplateItemRouterLink(item as RouterLinkType));
    } else if (item.type === 'Slot') {
      result.push(makeTemplateItemSlot(item as SlotType));
    }
  }

  return result.join('\n');
}

export function makeTemplateItemProps(
  props: Record<string, any> | undefined
): string {
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

export function makeTemplateItemComponent(item: ComponentType): string {
  const props = makeTemplateItemProps(item.props);
  const children = item.children?.length
    ? '\n' + makeTemplateItems(item.children) + '\n'
    : '';

  return `<${item.component}${props}>${children}</${item.component}>`;
}

export function makeTemplateItemElement(item: ElementType): string {
  const props = makeTemplateItemProps(item.props);
  const children = item.children?.length
    ? '\n' + makeTemplateItems(item.children) + '\n'
    : '';

  return `<${item.tag}${props}>${children}</${item.tag}>`;
}

export function makeTemplateItemText(item: TextType): string {
  return item.value;
}

export function makeTemplateItemIf(item: IfType): string {
  const children = item.children?.length
    ? '\n' + makeTemplateItems(item.children) + '\n'
    : '';

  return `<template v-if="${item.condition}">${children}</template>`;
}

export function makeTemplateItemElse(item: ElseType): string {
  const children = item.children?.length
    ? '\n' + makeTemplateItems(item.children) + '\n'
    : '';

  return `<template v-else>${children}</template>`;
}

export function makeTemplateItemIfElse(item: IfElseType): string {
  const children = item.children?.length
    ? '\n' + makeTemplateItems(item.children) + '\n'
    : '';

  return `<template v-else-if="${item.condition}">${children}</template>`;
}

export function makeTemplateItemFor(item: ForType): string {
  const children = item.children?.length
    ? '\n' + makeTemplateItems(item.children) + '\n'
    : '';

  if (item.array) {
    return `<template v-for="(${item.item}, index) in ${item.array}">${children}</template>`;
  } else if (item.object) {
    return `<template v-for="(${item.item}, key, index) in ${item.object}">${children}</template>`;
  }

  return '';
}

export function makeTemplateItemRouterView(item: RouterViewType): string {
  return `<router-view ${item.name}>\n</router-view>\n`;
}

export function makeTemplateItemRouterLink(item: RouterLinkType): string {
  const props = makeTemplateItemProps(item.props);
  const children = item.children?.length
    ? '\n' + makeTemplateItems(item.children) + '\n'
    : '';

  return `<RouterLink to="${item.to}" ${props}>${children}</RouterLink>\n`;
}

export function makeTemplateItemSlot(item: SlotType): string {
  const children = item.children?.length
    ? '\n' + makeTemplateItems(item.children) + '\n'
    : '';

  return `<slot name="${item.name}">${children}</slot>\n`;
}
