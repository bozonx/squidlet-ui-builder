import type {MenuDir} from '../../_sveltekit/src/lib/interfaces/MenuDir';
import type {Screen} from '../../_sveltekit/src/lib/interfaces/Screen';
import type {ScreensMenuFile} from '../../_sveltekit/src/lib/interfaces/ScreensMenuFile';
import type {MenuElement} from '../../_sveltekit/src/lib/interfaces/MenuElement';
import type {CustomComponent} from '../../_sveltekit/src/lib/interfaces/UiElement';



export const testData: Record<string, any> = {
  'menu/screensMenu': [
    {
      screenId: '00000011',
      children: [
        {
          screenId: '00000012'
        }
      ]
    }
  ] as ScreensMenuFile[],
  'menu/components': [
    {
      name: 'Some dir',
      type: 'dir',
      children: [
        {
          type: 'element',
          elId: '00000001',
        },
      ]
    } as MenuDir<MenuElement>,
  ],
  'menu/commonElements': [
    {
      name: 'Some dir',
      type: 'dir',
      children: [
        {
          type: 'element',
          elId: '00000002',
        },
      ]
    } as MenuDir<MenuElement>,,
  ],
  'menu/orderedLibs': [],
  'enabledLibs': [],

  'screens/00000011': {
    $id: '00000011',
    name: 'about',
  } as Screen,
  'screens/00000012': {
    $id: '00000012',
    name: 'nested',
  } as Screen,
  'elements/00000001': {
    $id: '00000001',
    name: 'My component',
    template: '<div>some content</div>',
  } as CustomComponent,
  'elements/00000002': {
    $id: '00000002',
    name: 'Button',
    template: '<div>btn</div>',
  } as CustomComponent,
}
