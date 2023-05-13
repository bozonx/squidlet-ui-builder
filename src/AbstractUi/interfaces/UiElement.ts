export interface UiElement {
  init(): Promise<void>
  destroy(): Promise<void>
}
