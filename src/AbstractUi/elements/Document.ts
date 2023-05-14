import {IndexedEvents} from 'squidlet-lib'
import {AnyElement} from '../interfaces/AnyElement.js'
import {UiElementDefinitionBase} from '../interfaces/UiElementDefinitionBase.js'
import {Component} from '../Component.js';


export interface DocumentDefinition extends UiElementDefinitionBase {
  children: UiElementDefinitionBase[]
}

export type DocumentEventHandler = (elementPath: string, eventName: string, data: any) => void



export const Document = `
name: Document
props:
  children:
    type: array
tmpl:
  - component: ForEach
    src: {this.children}
    as: child
    item:
      component: RenderComponent
      definition: {child}
`


// export class Document extends Component {
//   readonly events = new IndexedEvents<DocumentEventHandler>()
//   readonly elements: AnyElement[] = []
//
//   private readonly definition: DocumentDefinition
//
//
//   constructor(definition: DocumentDefinition) {
//     this.definition = definition
//   }
//
//
//   async init() {
//
//     console.log(1111, this)
//   }
//
//   async destroy() {
//     // TODO: destroy all the elements
//   }
//
//
//   on(elementPath: string, eventName: string, handler: (data: any) => void) {
//     return this.events.addListener((incomeElementPath: string, incomeEventName: string, data: any) => {
//       if (elementPath !== incomeElementPath && eventName !== incomeEventName) return
//
//       handler(data)
//     })
//   }
//
//   incomeEvent(elementPath: string, eventName: string, data: any) {
//     this.events.emit(elementPath, eventName, data)
//   }
//
//   async attach(elementPath: string, element: AnyElement) {
//     // TODO:
//   }
//
// }
