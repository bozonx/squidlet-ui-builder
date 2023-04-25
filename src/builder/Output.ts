import path from 'node:path';
import * as fs from 'node:fs/promises';
import {pathTrimExt} from 'squidlet-lib'
import {BuilderMain} from './BuilderMain.js';
import {mkdirP} from '../helpers/common.js';


export class Output {
  private readonly main: BuilderMain


  constructor(main: BuilderMain) {
    this.main = main
  }


  async init() {
    await fs.rm(`${this.main.options.outputDir}`, {recursive: true})
    await mkdirP(this.main.options.outputDir)
  }


  /**
   * Write file to output dir
   * @param subDir - directory relative to rootDir
   * @param fileName - only file name without dir
   * @param content
   */
  async write(subDir: string, fileName: string, content: string, replaceExt?: string,) {
    const dirPath = path.join(this.main.options.outputDir, subDir)
    const finalFileName: string = (replaceExt)
      ? `${pathTrimExt(fileName)}.${replaceExt}`
      : fileName
    const filePath = path.join(dirPath, finalFileName)

    await mkdirP(dirPath)
    await fs.writeFile(filePath, content, 'utf8')
  }

}
