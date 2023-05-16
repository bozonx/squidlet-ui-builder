export interface RenderedElement {
  // id of element in UI tree
  //elId: string

  // means component name
  elName: string
  // An empty string means it is root and don't have children
  // but do not check it - use Component.isRoot instead
  //parentElId: string
  // -1 means root
  parentChildPosition: number
  // id of component in component tree which is handle this element
  componentId: string
  // unified params for rendered element
  params?: Record<string, any>
  children?: RenderedElement[]
}
