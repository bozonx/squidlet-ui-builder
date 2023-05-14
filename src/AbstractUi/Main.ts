import yaml from 'yaml';
import {IndexedEventEmitter} from 'squidlet-lib'
import {ComponentsPool} from './ComponentsPool.js';
import {Component, ComponentDefinition} from './Component.js';
import {UiElementDefinition, UiElementDefinitionBase} from './interfaces/UiElementDefinitionBase.js';



export class Main {
  readonly events = new IndexedEventEmitter()
  componentPool: ComponentsPool
  rootComponent: Component


  constructor(rootComponentDefinitionStr: string) {
    this.componentPool = new ComponentsPool()

    const rootComponentDefinition: ComponentDefinition = yaml.parse(rootComponentDefinitionStr)

    this.rootComponent = new Component(this, rootComponentDefinition)
  }


  async init() {

    // TODO: должны создаться все инстансы, которые в данный момент изображены
    // TODO: должно подняться событие на отрисовку, чтобы тг бот отрисовал меню
    //         * говорится корень откуда отрисовывать и дерево элементов с параметрами
    // TODO: должны начать слушаться события извне - из телеграм бота

    await this.rootComponent.init()
    // mount root component
    await this.rootComponent.render('/', 0)
  }


  emitRender(rootElId: string, childPosition: number, tmpl: UiElementDefinition) {

  }

}
