import {SchemaItemType} from '../../types/SchemaItem.js';


export function makeValueCorrespondingType(type: SchemaItemType, value: any): any {
  switch (type) {
    case 'number':
      return parseInt(value)
    case 'string':
      return '"' + String(value) + '"'
    case 'null':
      return null
    default:
      // TODO: что с остальными типами???
      return value
  }
}
