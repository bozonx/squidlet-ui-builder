export interface CustomComponent {
  // uniq id of component. It uses to bind with other components
  $id?: string,
  name: string,
  template: string
}
