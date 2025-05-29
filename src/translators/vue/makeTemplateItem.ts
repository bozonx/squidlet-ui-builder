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
  let result = '';

  for (const item of items) {
    if (item.type === 'Element') {
      result += '\n' + makeTemplateItemElement(item as ElementType);
    } else if (item.type === 'Text') {
      result += '\n' + makeTemplateItemText(item as TextType);
    } else if (item.type === 'Component') {
      result += '\n' + makeTemplateItemComponent(item as ComponentType);
    } else if (item.type === 'If') {
      result += '\n' + makeTemplateItemIf(item as IfType);
    } else if (item.type === 'Else') {
      result += '\n' + makeTemplateItemElse(item as ElseType);
    } else if (item.type === 'IfElse') {
      result += '\n' + makeTemplateItemIfElse(item as IfElseType);
    } else if (item.type === 'For') {
      result += '\n' + makeTemplateItemFor(item as ForType);
    } else if (item.type === 'RouterView') {
      result += '\n' + makeTemplateItemRouterView(item as RouterViewType);
    } else if (item.type === 'RouterLink') {
      result += '\n' + makeTemplateItemRouterLink(item as RouterLinkType);
    } else if (item.type === 'Slot') {
      result += '\n' + makeTemplateItemSlot(item as SlotType);
    }
  }

  return result;
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
    ? makeTemplateItems(item.children) + '\n'
    : '';

  return `<${item.component}${props}>${children}\n</${item.component}>\n`;
}

export function makeTemplateItemElement(item: ElementType): string {
  const props = makeTemplateItemProps(item.props);
  const children = item.children?.length
    ? makeTemplateItems(item.children)
    : '';

  return `<${item.tag}${props}>${children}\n</${item.tag}>\n`;
}

export function makeTemplateItemText(item: TextType): string {
  return item.value;
}

export function makeTemplateItemIf(item: IfType): string {
  const children = item.children?.length
    ? makeTemplateItems(item.children)
    : '';

  return `<template v-if="${item.condition}">\n${children}</template>\n`;
}

export function makeTemplateItemElse(item: ElseType): string {
  const children = item.children?.length
    ? makeTemplateItems(item.children)
    : '';

  return `<template v-else>\n${children}</template>\n`;
}

export function makeTemplateItemIfElse(item: IfElseType): string {
  const children = item.children?.length
    ? makeTemplateItems(item.children)
    : '';

  return `<template v-else-if="${item.condition}">\n${children}</template>\n`;
}

export function makeTemplateItemFor(item: ForType): string {
  const children = item.children?.length
    ? makeTemplateItems(item.children)
    : '';

  if (item.array) {
    return `<template v-for="(${item.item}, index) in ${item.array}">\n${children}</template>\n`;
  } else if (item.object) {
    return `<template v-for="(${item.item}, key, index) in ${item.object}">\n${children}</template>\n`;
  }

  return '';
}

export function makeTemplateItemRouterView(item: RouterViewType): string {
  return `<router-view ${item.name}>\n</router-view>\n`;
}

export function makeTemplateItemRouterLink(item: RouterLinkType): string {
  const props = makeTemplateItemProps(item.props);
  const children = item.children?.length
    ? makeTemplateItems(item.children)
    : '';

  return `<RouterLink to="${item.to}" ${props}>${children}\n</RouterLink>\n`;
}

export function makeTemplateItemSlot(item: SlotType): string {
  const children = item.children?.length
    ? makeTemplateItems(item.children)
    : '';

  return `<slot name="${item.name}">${children}\n</slot>\n`;
}
