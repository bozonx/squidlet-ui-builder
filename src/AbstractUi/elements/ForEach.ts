export const FOR_EACH_COMPONENT = `
props:
  src:
    type: array
  as:
    type: string
  # it is props of component
  item:
    type: object

tmplExp: 'for (const item of src) this.main.newComponentFromTmpl(item)'
`
