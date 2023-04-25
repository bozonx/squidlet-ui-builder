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


  /**
   * Write file to output dir
   * @param subDir - directory relative to rootDir
   * @param fileName - only file name without dir
   * @param content
   */
  async write(subDir: string, fileName: string, content: string) {
    const dirPath = path.join(this.main.options.outputDir, subDir)
    const filePath = path.join(dirPath, fileName)

    await this.main.mkdirP(dirPath)
    await fs.writeFile(filePath, content, 'utf8')
  }

}
