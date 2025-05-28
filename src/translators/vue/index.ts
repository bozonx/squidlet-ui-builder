import { Translator } from "@/types/Translator"
import { makeComponent } from "./makeComponent"
import { ComponentSchema } from "@/types/ComponentSchema"

export const vueTranslator: Translator = {
  translateProject: (schemas: ComponentSchema[]) => {
    const components = []
    for (const schema of schemas) {
      components.push(makeComponent(schema))
    }

    return "Vue"
  }
}