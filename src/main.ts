import {
  Main,
  SYSTEM_EVENTS,
  APP_EVENTS,
  IncomeEvent,
  RenderedElement
} from 'squidlet-abstract-ui'
import {App} from './App.ts';
import './style.css'


(async () => {
  const main = new Main()

  main.setApp(App)

  main.systemEvents.once(SYSTEM_EVENTS.newApp, (app) => {
    app.events.addListener(APP_EVENTS.render, (event: IncomeEvent, el: RenderedElement) => {
      console.log(111, event, el)
    })
  })

  await main.init()
})()
  .catch(console.error)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    test
  </div>
`

// element.addEventListener('click', () => setCounter(counter + 1))
//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
