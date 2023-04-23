import type {CustomComponent} from './CustomComponent';


export interface ComponentDir {
  $id: string,
  name: string,
  type: 'ComponentDir',
  children: CustomComponent[],
}
