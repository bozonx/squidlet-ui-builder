import {SchemaItem} from './SchemaItem.js';


export interface CommonComponent {
  props: Record<string, SchemaItem>
  state: Record<string, SchemaItem>
  tmpl: string
  styles: string
}
