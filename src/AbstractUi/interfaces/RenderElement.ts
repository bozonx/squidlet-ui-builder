export interface RenderElement {
  elId: string
  parentElId: string
  parentChildPosition: number
  componentId: string
  // params for rendered element
  params: Record<string, any>
  children: RenderElement[]
}
