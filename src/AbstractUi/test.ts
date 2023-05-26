import {pathDirname} from 'squidlet-lib';
import * as fs from 'node:fs/promises';
import {fileURLToPath} from 'url';
import {Main} from './Main.js';
import path from 'node:path';
import {preloader} from './preloader.js';
import {IncomeEvents, OutcomeEvents} from './interfaces/DomEvents.js';
import {RenderedElement} from './interfaces/RenderedElement.js';
import {transformToTg} from '../renderTelegram/transformToTg.js';
import {goodUiPlugin} from './goodUi/goodUiPlugin.js';
import {routerPlugin} from './router/routerPlugin.js';


(async () => {
  const filename: string = fileURLToPath(import.meta.url)
  const dirname: string = pathDirname(filename)

  const filesRoot = path.resolve(dirname, '../../../sls-publish-bot/src/ui/')

  const definitions = await preloader(
    path.resolve(filesRoot, 'root.yaml'),
    (pathTo: string) => fs.readFile(path.resolve(filesRoot, pathTo), 'utf8')
  )

  const main = new Main()

  main.use(goodUiPlugin())
  main.use(routerPlugin())
  // better to register them after all the plugins in case to avoid overlay
  main.componentsManager.registerComponents(definitions)


  main.outcomeEvents.addListener((event: OutcomeEvents, el: RenderedElement) => {
    //console.log(2222, event, JSON.stringify(el, null, 2))

    const [tgButtons, message] = transformToTg(el)

    console.log(3333, message, tgButtons, (tgButtons[0][0] as any).callback_data)

    setTimeout(() => {
      main.emitIncomeEvent(
        IncomeEvents.click,
        (tgButtons[0][0] as any).callback_data,
        'data111'
      )
    }, 100)

  })


  await main.init()


})()
