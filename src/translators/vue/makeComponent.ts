import { ComponentSchema, TemplateItem } from "../../types/ComponentSchema"

export function makeComponent(schema: ComponentSchema): string {
  const template = makeTemplate(schema)

  return `${template}`
}

function makeTemplate(schema: ComponentSchema): string {
  let result = ''

  for (const item of schema.template) {
    result += '\n' + makeTemplateItemComponent(item)
  }

  return `<template>${result}</template>`
}

function makeTemplateItemComponent(item: TemplateItem): string {
  const props = makeProps(item.props)
  const children = item.children?.length
    ? '\n' + item.children.map(child => makeTemplateItemComponent(child)).join('\n')
    : ''

  return `<${item.component}${props}>${children}\n</${item.component}>\n`
}

function makeProps(props: Record<string, any> | undefined): string {
  if (!props) return ''

  const result = []

  for (const key in props) {
    const prop = props[key]

    if (prop.type === 'vprog') {
      result.push(`:${key}="${prop.value}"`)
    } else if (prop.type === 'expression') {
      result.push(`${key}="${prop.value}"`)
    } else if (prop.type === 'string') {
      result.push(`${key}="${prop.value}"`)
    }
  }

  return ' ' + result.join(' ')
}
