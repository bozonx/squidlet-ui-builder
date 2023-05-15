export const ForEach = `
name: ForEach
props:

    src:
      $exp: getProp
      path: children
    do:
      $exp: superFunc
      lines:
        - $exp: funcReturn
          value:
            $exp: getJsValue
            path: item

  src:
    type: any[]
#  as:
#    type: string
  item:
    type: Component
tmpl:
  - $exp: forEach
    src:
      $exp: getProp
      path: src
    as:
      $exp: getProp
      path: as
    do:
      $exp: superFunc
      lines:
        -
#tmplExp: 'for (const item of src) this.main.newComponentFromTmpl(item)'
`
