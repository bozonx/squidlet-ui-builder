import {ComponentDefinition} from 'squidlet-abstract-ui'


export const AppMenu: ComponentDefinition = {
  name: 'AppMenu',
  tmpl: [
    {
      component: 'NavVertical',
      slot: [
        {
          component: 'NavItem',
          value: 'first item',
          to: '/some',
          icon: 'edit',
        }
      ]
    }
  ]
}
