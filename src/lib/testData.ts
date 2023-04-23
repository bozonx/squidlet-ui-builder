import type {ComponentsCollection} from './interfaces/types';
import type {ComponentDir} from './interfaces/ComponentDir';


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
