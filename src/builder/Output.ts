import path from 'node:path';
import * as fs from 'node:fs/promises';
import {BuilderMain} from './BuilderMain.js';


export class Output {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  async init() {
    await this.main.mkdirP(this.main.options.outputDir)
  }


  async write(fileName: string, dir: string, content: string) {
    const dirPath = path.join(this.main.options.outputDir, dir)
    const filePath = path.join(dirPath, fileName)

    await this.main.mkdirP(dirPath)
    await fs.writeFile(filePath, content, 'utf8')
  }

}
