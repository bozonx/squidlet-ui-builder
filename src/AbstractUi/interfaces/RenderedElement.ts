export interface RenderedElement {
  // id of element in UI tree
  elId: string
  // means component name
  elName: string
  // undefined means root
  parentElId?: string
  // undefined means root
  parentChildPosition?: number
  // id of component in component tree which is handle this element
  componentId: string
  // unified params for rendered element
  params?: Record<string, any>
  children?: RenderedElement[]
}
