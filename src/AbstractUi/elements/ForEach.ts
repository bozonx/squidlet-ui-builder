export const FOR_EACH_COMPONENT = `
props:
  src:
    type: array
  as:
    type: string
  # it is props of component
  item:
    type: object

tmpl:
  component: Expression
  exp: 'for (const item of src) this.main.newComponentFromTmpl(item)'
`
