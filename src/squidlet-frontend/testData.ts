import type {ComponentsCollection} from '../lib/interfaces/types';
import type {ComponentDir} from '../lib/interfaces/ComponentDir';
import type {Screen} from '../lib/interfaces/Screen';
import type {Library} from '../lib/interfaces/Library';


export const screens: Screen[] = [
  {
    name: 'about',
    children: [

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

export const testCommonElements: ComponentsCollection = [
  {
    name: 'Some dir',
    type: 'ComponentDir',
    children: [
      {
        name: 'Button',
        type: 'CustomComponent',
        template: '<div>btn</div>',
      },
    ]
  } as ComponentDir,
]

export const testLibs: Library[] = [
  {
    name: 'my base elements',
    elements: [
      {
        name: 'LibComponent',
        type: 'CustomComponent',
        template: '<div>lib content</div>',
      },
    ]
  }
]
