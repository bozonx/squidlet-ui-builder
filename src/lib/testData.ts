import type {ComponentsCollection} from './interfaces/types';
import type {ComponentDir} from './interfaces/ComponentDir';
import type {Screen} from './interfaces/Screen';


export const screens: Screen[] = [
  {
    name: 'about',
    children: [
      {
        name: 'page1'
      }
    ]
  }
]

export const testComponents: ComponentsCollection =  [
  {
    name: 'Some dir',
    type: 'ComponentDir',
    children: [
      {
        name: 'My component',
        type: 'CustomComponent',
        template: '<div>some content</div>',
      },
    ]
  } as ComponentDir,
]
