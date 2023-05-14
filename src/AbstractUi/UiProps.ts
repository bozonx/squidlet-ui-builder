import {IndexedEvents} from 'squidlet-lib';


// TODO: read only???
// TODO: use proxy
// TODO: сделать реактивными - добавить subscribe()
// TODO: поддержка валидации по типу
export interface PropDefinition {
  // TODO: get normal props
  type: string | number
}


export class UiProps<P = Record<string, any>> {
  changeEvent = new IndexedEvents()

  props: P = {} as P


  constructor(propsDefinition: Record<string, PropDefinition>, initialValues?: P) {

  }

  destroy() {
    this.changeEvent.destroy()
  }


  getValue() {

  }

  setValue() {

  }

}