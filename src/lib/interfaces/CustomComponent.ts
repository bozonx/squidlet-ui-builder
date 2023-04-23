import type {ComponentType} from './types';


export interface CustomComponent {
  // uniq id of component. It uses to bind with other components
  $id?: string,
  name: string,
  type: ComponentType,
  template: string

}
