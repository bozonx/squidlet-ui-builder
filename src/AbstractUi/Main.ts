import {ComponentsPool} from './ComponentsPool.js';
import {Component, ComponentDefinition} from './Component.js';
import yaml from 'yaml';



export class Main {
  componentPool: ComponentsPool
  rootComponent: Component


  constructor(rootComponentDefinitionStr: string) {
    this.componentPool = new ComponentsPool()

    const rootComponentDefinition: ComponentDefinition = yaml.parse(rootComponentDefinitionStr)

    this.rootComponent = new Component(this, rootComponentDefinition)
  }


  async init() {
    await this.rootComponent.init()
  }

}
