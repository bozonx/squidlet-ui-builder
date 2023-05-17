import {pathDirname} from 'squidlet-lib';
import * as fs from 'node:fs/promises';
import {fileURLToPath} from 'url';
import {Main} from './Main.js';
import path from 'node:path';
import {preloader} from './preloader.js';
import {GOOD_UI} from './goodUi/index.js';
import {OutcomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {transformToTg} from '../renderTelegram/transformToTg.js';
import {ROUTER_COMPONENT} from './router/index.js';


(async () => {
  const filename: string = fileURLToPath(import.meta.url)
  const dirname: string = pathDirname(filename)

  const definitions = await preloader(
    path.resolve(dirname, '../../../sls-publish-bot/src/ui/root.yaml'),
    (pathTo: string) => fs.readFile(pathTo, 'utf8')
  )

  const libs = {
    goodUi: GOOD_UI,
    router: ROUTER_COMPONENT,
  }
  const main = new Main(definitions, libs)


  main.outcomeEvents.addListener((event: OutcomeEvents, el: RenderedElement) => {
    console.log(2222, event, JSON.stringify(el, null, 2))

    const [tgButtons, message] = transformToTg(el)

    console.log(3333, message, tgButtons)
  })


  await main.init()
})()
