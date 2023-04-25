import path from 'node:path';
import {exec} from 'node:child_process';
import * as fs from 'node:fs/promises';
import {pathTrimExt} from 'squidlet-lib'
import {BuilderMain} from './BuilderMain.js';
import {fileExists, mkdirP} from '../helpers/common.js';
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class Output {
  private readonly main: BuilderMain


  get packageJsonPath(): string {
    return path.join(this.main.options.outputDir, 'package.json')
  }


  constructor(main: BuilderMain) {
    this.main = main
  }


  async init() {
    await mkdirP(this.main.options.outputDir)
    await this.clear()
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

    await fs.writeFile(this.packageJsonPath, jsonStr, 'utf8')
  }

  async installDeps() {
    if (!this.main.options.force && await fileExists(this.packageJsonPath)) return

    await new Promise<void>((resolve, reject) => {
      const packages = [
        '@sveltejs/vite-plugin-svelte',
        'svelte',
        'vite'
      ]
      const cmd = `npm install -D ${packages.join(' ')}`
      exec(
        cmd,
        {cwd: this.main.options.outputDir},
        (error, stdout, stderr) => {
          if (error) return reject(error)

          console.log(stdout)

          resolve()
        }
      )
    })
  }


  private async clear() {
    const toDelete = (await fs.readdir(this.main.options.outputDir))
      .filter((el) => !['node_modules', 'package.json'].includes(el))

    for (const fileOrDir of toDelete) {
      await fs.rm(path.join(this.main.options.outputDir, fileOrDir), {recursive: true})
    }
  }

}
