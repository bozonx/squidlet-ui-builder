import {AppDefinition} from 'squidlet-abstract-ui'
import {AppMenu} from './components/AppMenu.ts';


export const App: AppDefinition = {
  components: [
    AppMenu,
  ],
  screens: [
    //AppScreen,
  ],
  routes: [
    //AppRoute,
  ],
  tmpl: [
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
