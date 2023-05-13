
// TODO: а это нужно ???

import {Fragment, fragment, FRAGMENT_TYPE} from './Fragment';
import {AnyElement} from '../interfaces/AnyElement';


export const TEMPLATE_ROOT_NANE = 'root'


export function templateRoot(children: AnyElement[]): Fragment {
  return fragment({
    name: TEMPLATE_ROOT_NANE,
    children,
  })
}
