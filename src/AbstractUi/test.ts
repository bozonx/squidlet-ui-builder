import * as fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'url';
import {Main} from './Main.js';


const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = path.dirname(__filename)


(async () => {
  const rootComponentDefinitionStr: string = await fs.readFile(
    path.resolve(__dirname, '../../../sls-publish-bot/src/ui/root.yaml'),
    'utf8'
  )

  const main = new Main(rootComponentDefinitionStr)

  await main.init()
})()
