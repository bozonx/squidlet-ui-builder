import {IndexedEvents} from 'squidlet-lib';


// TODO: use proxy
// TODO: можно добавить ф-ю генерирующую значение из других данных

export interface StateDefinition {
  // TODO: add other params
  type: string | number
}



export class UiState<S = Record<string, StateDefinition>> {
  changeEvent = new IndexedEvents()

  state: S = {} as S


  constructor(stateDefinition: Record<string, StateDefinition> = {}, initialValues?: S) {

  }

  destroy() {
    this.changeEvent.destroy()
  }


  getValue() {

  }

  setValue() {

  }

}
