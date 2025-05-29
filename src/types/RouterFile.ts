export interface RouterFile {
  routes: Route[];
}

export interface Route {
  path: string;
  name: string;
  view: string;
}
