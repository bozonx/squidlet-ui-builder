


export const Link = `
name: Link
uiParams:
  - path
  - text
handlers:
  click:
    $exp: superFunc
    lines:
      - $exp: jsCall
        $jsExp: console.log(555, data)
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
