import {
  Main,
  SYSTEM_EVENTS,
  APP_EVENTS,
  RenderEvents,
  RenderedElement
} from 'squidlet-abstract-ui'
import {HtmlRenderer} from 'squidlet-abstract-ui'
import {App} from './App.ts';
import 'squidlet-abstract-ui/src/rendererHtml/style.css'
import './style.css'


(async () => {
  const main = new Main()
  const htmlRenderer = new HtmlRenderer('#app')

  main.setApp(App)

  main.systemEvents.once(SYSTEM_EVENTS.newApp, (app) => {
    app.events.addListener(APP_EVENTS.render, (event: RenderEvents, el: RenderedElement) => {
      htmlRenderer.render(event, el)
    })
  })

  htmlRenderer.init()

  await main.init()
})()
  .catch(console.error)
