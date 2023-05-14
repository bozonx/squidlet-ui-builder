export interface RenderedElement {
  // id of element in UI tree
  elId: string
  // means component name
  elName: string
  parentElId: string
  parentChildPosition: number
  // id of component in component tree which is handle this element
  componentId: string
  // unified params for rendered element
  params?: Record<string, any>
  children?: RenderedElement[]
}
