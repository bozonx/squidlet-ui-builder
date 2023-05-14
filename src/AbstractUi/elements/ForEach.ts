export const ForEach = `
name: ForEach
props:
  src:
    type: any[]
  as:
    type: string
  item:
    type: Component
tmpl:
  - $exp: forEach
    arr:
      $exp: getProp
      path: src
    as:
      $exp: getProp
      path: as
    do:
      $exp: func
      ???
#tmplExp: 'for (const item of src) this.main.newComponentFromTmpl(item)'
`
