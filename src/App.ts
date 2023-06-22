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
      component: 'AppMenu',
    },
    {
      component: 'Div',
      slot: [
        {
          component: 'Text',
          value: 'some text',
        }
      ]
    },
  ]
}
