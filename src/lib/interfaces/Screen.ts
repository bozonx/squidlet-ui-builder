export interface Screen {
  $id?: string
  name: string
  children?: Screen[]
}