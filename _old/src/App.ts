import {AppDefinition} from 'squidlet-abstract-ui'
import {AppMenu} from './components/AppMenu.ts';


export const App: AppDefinition = {
  components: [
    AppMenu,
  ],
  screens: [
  ],
  routes: [
  ],
  tmpl: [
    {
      component: 'Layout2Col',
      leftColWidth: '20em',
      slot: {
        left: [
          {
            component: 'AppMenu',
          },
        ],
        right: [
          {
            component: 'Div',
            slot: [
              {
                component: 'Text',
                value: 'some text',
              }
            ]
          },
        ],
      }
    },
  ]
}
