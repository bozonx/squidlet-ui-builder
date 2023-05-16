import {pathDirname} from 'squidlet-lib';
import * as fs from 'node:fs/promises';
import {fileURLToPath} from 'url';
import {Main} from './Main.js';
import path from 'node:path';
import {preloader} from './preloader.js';
import {GOOD_UI} from './goodUi/index.js';


(async () => {
  const filename: string = fileURLToPath(import.meta.url)
  const dirname: string = pathDirname(filename)

  const definitions = await preloader(
    path.resolve(dirname, '../../../sls-publish-bot/src/ui/root.yaml'),
    (pathTo: string) => fs.readFile(pathTo, 'utf8')
  )

  const libs = {
    //goodUi: GOOD_UI
  }
  const main = new Main(definitions, libs)

  await main.init()
})()
