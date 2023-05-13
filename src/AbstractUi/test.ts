import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {render} from './render.js';
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


(async () => {
  const fileContent: string = await fs.readFile(
    path.resolve(__dirname, '../../../sls-publish-bot/src/ui/root.yaml'),
    'utf8'
  )

  await render(fileContent, async (fileName: string) => {
    // TODO: add root path
    return fs.readFile(fileName, 'utf8')
  })
})()
