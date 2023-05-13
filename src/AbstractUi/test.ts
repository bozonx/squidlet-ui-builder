import {pathDirname} from 'squidlet-lib';
import * as fs from 'node:fs/promises';
import {fileURLToPath} from 'url';
import {Main} from './Main.js';
import path from 'node:path';


(async () => {
  const filename: string = fileURLToPath(import.meta.url)
  const dirname: string = pathDirname(filename)

  const rootComponentDefinitionStr: string = await fs.readFile(
    path.resolve(dirname, '../../../sls-publish-bot/src/ui/root.yaml'),
    'utf8'
  )

  const main = new Main(rootComponentDefinitionStr)

  await main.init()
})()
