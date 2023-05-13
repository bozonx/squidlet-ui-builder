export const RENDER_COMPONENT_COMPONENT = `
props:
  definition:
    type: Component
tmpl:
  component: Expression
  context: this
  exp: 'this.main.newComponentFromTmpl(definition)'
`
