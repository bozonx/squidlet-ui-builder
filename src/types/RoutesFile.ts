export interface RouteDefinition {
  name: string
  component: string
  layout: string
}

export interface RoutesFile {
  routes: RouteDefinition[]
}
