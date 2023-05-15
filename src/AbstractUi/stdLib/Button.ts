import {INPUT_DEFAULTS, InputBase, InputInitial} from '../interfaces/InputBase';


export const BUTTON_TYPE = 'Button'


export interface Button extends InputBase {
  type: typeof BUTTON_TYPE
  disabled: boolean
  text: string
  onClick(): void
}


export function button(params: InputInitial<Button>): Button {
  return {
    type: BUTTON_TYPE,
    ...INPUT_DEFAULTS,
    ...params,
  }
}
