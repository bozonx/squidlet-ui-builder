


export const Link = `
name: Link
uiParams:
  - path
  - text
handlers:
  click:
    $exp: superFunc
    vars:
      pathToRoute:
        $exp: getPrimitive
        path: context.args[0]
    lines:
      - $exp: jsCall
        $jsExp: console.log(555, context.data, context.pathToRoute)
      - $exp: superCall
        path: app.router.toPath
        params:
          path:
            $exp: getPrimitive
            path: context.pathToRoute

`

// export const LINK_TYPE = 'Link'
//
//
// export interface Link extends InputBase {
//   type: typeof LINK_TYPE
//   disabled: boolean
//   text: string
//   path: string
// }
//
//
// export function link(params: InputInitial<Link>): Link {
//   return {
//     type: LINK_TYPE,
//     ...INPUT_DEFAULTS,
//     ...params,
//   }
// }
