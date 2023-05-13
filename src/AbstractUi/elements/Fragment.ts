import {AnyElement} from '../interfaces/AnyElement';
import {ELEMENT_DEFAULTS, ElementBase, ElementInitial} from '../interfaces/ElementBase';


export const FRAGMENT_TYPE = 'Fragment'


const FRAGMENT_COMPONENT = `
props:
  children:
    type: array
tmpl:
  component ForEach
  src: {children}
  as: 'child'
  item:
    component: AnyElement
    tmpl: {child}
`

export interface Fragment extends ElementBase {
  type: typeof FRAGMENT_TYPE
  children: AnyElement[]
}

export function fragment(params: ElementInitial<Fragment>): Fragment {
  return {
    type: FRAGMENT_TYPE,
    ...ELEMENT_DEFAULTS,
    ...params,
  }
}
