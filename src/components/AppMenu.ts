import {ComponentDefinition} from 'squidlet-abstract-ui'


export const AppMenu: ComponentDefinition = {
  name: 'AppMenu',
  tmpl: [
    {
      component: 'NavVertical',
      slot: [
        {
          component: 'NavItem',
          props: {
            value: 'first item',
            icon: 'edit',
          }
        }
      ]
    }
  ]
}
