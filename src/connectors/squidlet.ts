/// <reference lib="dom" />

declare const window: Window & typeof globalThis;


export const SQUIDLET_API_HANDLER = {
  API: 'API',
  STATE: 'STATE',
  CONFIG: 'CONFIG',
  APP: 'APP'
}

export const API_BASE_PATH = '/api/v1/app'

export interface SquidletConnectorSetup {
  connection: 'WS' | 'HTTP'
  apiBaseUrl: string
}

export class Squidlet {
  private setup: SquidletConnectorSetup

  constructor(setup: SquidletConnectorSetup) {
    this.setup = setup
  }

  // States of app
  
  async getTabState(name: string): Promise<any> {
    window.localStorage.getItem('STATE_' + name)
  }
  
  async setTabState(name: string, value: any): Promise<void> {
    return window.localStorage.setItem('STATE_' + name, value)
  }

  async removeTabState(name: string): Promise<void> {
    return window.localStorage.removeItem('STATE_' + name)
  }

  async getLocalState(name: string): Promise<any> {
    return this._callBackend(SQUIDLET_API_HANDLER.STATE, 'getLocal', {name})
  }

  async setLocalState(name: string, value: any): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.STATE, 'setLocal', {name, value})
  }

  async removeLocalState(name: string): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.STATE, 'removeLocal', {name})
  }

  async getSyncState(name: string): Promise<any> {
    return this._callBackend(SQUIDLET_API_HANDLER.STATE, 'getSync', {name})
  }

  async setSyncState(name: string, value: any): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.STATE, 'setSync', {name, value})
  }

  async removeSyncState(name: string): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.STATE, 'removeSync', {name})
  }

  // Configs
  async getTabConfig(name: string): Promise<any> {
    window.localStorage.getItem('CONFIG_' + name)
  }

  async setTabConfig(name: string, value: any): Promise<void> {
    window.localStorage.setItem('CONFIG_' + name, value)
  }

  async removeTabConfig(name: string): Promise<void> {
    return window.localStorage.removeItem('CONFIG_' + name)
  }

  async getLocalConfig(name: string): Promise<any> {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'getLocal', {name})
  }

  async setLocalConfig(name: string, value: any) {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'setLocal', {name, value})
  }

  async removeLocalConfig(name: string): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'removeLocal', {name})
  }

  async getSyncConfig(name: string): Promise<any> {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'getSync', {name})
  }

  async setSyncConfig(name: string, value: any): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'setSync', {name, value})
  }

  async removeSyncConfig(name: string): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'removeSync', {name})
  }

  // Builtin configs of app by developers
  async getBuiltinConfig(name: string): Promise<any> {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'getBuiltin', {name})
  }

  async setBuiltinConfig(name: string, value: any): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'setBuiltin', {name, value})
  }

  async removeBuiltinConfig(name: string): Promise<void> {
    return this._callBackend(SQUIDLET_API_HANDLER.CONFIG, 'removeBuiltin', {name})
  }

 
  // Call server-side api of the app

  async api(name: string, data: any): Promise<any> {
    return this._callBackend(SQUIDLET_API_HANDLER.API, name, data)
  }

  _callBackend(apiHandler: string, name: string, data: any): Promise<any | undefined> {
    if (this.setup.connection === 'HTTP') {
      return fetch(this.setup.apiBaseUrl + '/api/v1/app/' + name, {
        method: 'POST',
        body: JSON.stringify({
          apiHandler,
          name,
          data
        })
      })
    } else if (this.setup.connection === 'WS') {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(this.setup.apiBaseUrl + '/api/v1/app/' + name)
        ws.onmessage = (event) => {
          resolve(JSON.parse(event.data))
        }
      })
    }
    
    return Promise.reject(new Error('Unsupported connection type'))
  }

}