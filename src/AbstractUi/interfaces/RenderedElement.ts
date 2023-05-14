export interface RenderedElement {
  elId: string
  parentElId: string
  parentChildPosition: number
  componentId: string
  // unified params for rendered element
  params?: Record<string, any>
  children?: RenderedElement[]
}
