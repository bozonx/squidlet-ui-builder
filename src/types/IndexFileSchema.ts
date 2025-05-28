import { ComponentSchema } from "./ComponentSchema"

export interface IndexFileSchema {
  // TODO: strict name like name of package
  name: string
  title: string
  description: string
  components: ComponentSchema[]
}
