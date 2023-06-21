import {Main, SYSTEM_EVENTS, APP_EVENTS} from 'squidlet-abstract-ui'
import {App} from '../../src/components/App';


(async () => {
  const main = new Main()

  await main.setApp(App)

  main.systemEvents.once(SYSTEM_EVENTS.newApp, (app) => {
    app.events.addListener(APP_EVENTS.render, (event, el) => {
      console.log(111, event, el)
    })
  })

  await main.init()
})()
