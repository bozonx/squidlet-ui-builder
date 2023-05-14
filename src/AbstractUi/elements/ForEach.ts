export const FOR_EACH_COMPONENT = `
name: ForEach
props:
  src:
    type: array
  as:
    type: string
  item:
    type: object

tmplExp: 'for (const item of src) this.main.newComponentFromTmpl(item)'
`
