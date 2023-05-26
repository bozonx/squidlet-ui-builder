
export interface UiElementDefinitionBase {
  component: string
  slot?: UiElementDefinition[]
}

export interface UiElementDefinition extends UiElementDefinitionBase {
  // props
  [index: string]: any
}
