import path from 'node:path';
import {exec} from 'node:child_process';
import * as fs from 'node:fs/promises';
import {pathTrimExt} from 'squidlet-lib'
import {BuilderMain} from './BuilderMain.js';
import {mkdirP} from '../helpers/common.js';
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
    const dirPath = path.join(this.main.options.outputDir, 'src', subDir)
    const finalFileName: string = (replaceExt)
      ? `${pathTrimExt(fileName)}.${replaceExt}`
      : fileName
    const filePath = path.join(dirPath, finalFileName)

    await mkdirP(dirPath)
    await fs.writeFile(filePath, content, 'utf8')
  }

  async copyPeripheralStatic() {
    const source = path.join(__dirname, '../peripheral/asIs')
    const dest = path.join(this.main.options.outputDir)

    await fs.cp(source, dest,{recursive: true})
  }

  async makePackageJson() {
    const jsonStr = JSON.stringify({
      "name": `${this.main.options.prjName}`,
      "private": true,
      "version": "0.0.1",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
    }, null, 2)
    const packageJsonPath = path.join(this.main.options.outputDir, 'package.json')

    await fs.writeFile(packageJsonPath, jsonStr, 'utf8')
  }

  async installDeps() {
    await new Promise<void>((resolve, reject) => {
      const packages = [
        '@sveltejs/vite-plugin-svelte',
        'svelte',
        'vite'
      ]
      const cmd = `cd ${this.main.options.outputDir}; npm install -D ${packages.join(' ')}`
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(error)

        console.log(stdout)

        resolve()
      })
    })
  }

}
