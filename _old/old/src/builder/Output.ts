import path from 'node:path';
import * as fs from 'node:fs/promises';
import {BuilderMain} from './BuilderMain.ts';
import {mkdirP, simpleExec} from './buildHelpers.ts';
import {fileURLToPath} from 'url';
import {ROOT_DIRS} from '../types/constants.ts';


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
   * @param outputSubDir - directory relative to rootDir
   * @param fileName - only file name without dir
   * @param content
   */
  async createFile(outputSubDir: string, fileName: string, content: string) {
    const dirPath = path.join(this.main.options.outputDir, 'src', outputSubDir)
    const filePath = path.join(dirPath, fileName)

    await mkdirP(dirPath)
    await fs.writeFile(filePath, content, 'utf8')
  }

  async copyPeripheralStatic() {
    const source = path.resolve(__dirname, '../peripheral/asIs')
    const dest = this.main.options.outputDir

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
    if (!this.main.options.force && !this.main.isInitialBuild) return

    const packages = [
      '@sveltejs/vite-plugin-svelte',
      'svelte',
      'vite',
      'prettier',
      'prettier-plugin-tailwindcss',
      'vitawind',
      'svelte-router-spa',
      // TODO: зачем ???
      'cross-env',
    ]
    const cmd = `npm install -D ${packages.join(' ')}`

    await simpleExec(cmd, this.main.options.outputDir)
  }

  async buildSystem() {
    const tsConfigPath = path.resolve(__dirname, `../${ROOT_DIRS.system}/tsconfig.json`)
    const outDir = path.resolve(__dirname, `../../_build/src/${ROOT_DIRS.system}`)
    const cmd = `tsc --project ${tsConfigPath} --outDir ${outDir}`

    await simpleExec(cmd, this.main.options.outputDir)
  }

  async buildUserLib() {
    const srcDir = path.join(this.main.options.prjDir, ROOT_DIRS.lib)
    const dstDir = path.join(this.main.options.outputDir, 'src', ROOT_DIRS.lib)

    await mkdirP(srcDir)
    await fs.cp(srcDir, dstDir, {recursive: true})
  }


  private async clear() {
    const toDelete = (await fs.readdir(this.main.options.outputDir))
      .filter((el) => !['node_modules', 'package.json'].includes(el))

    for (const fileOrDir of toDelete) {
      await fs.rm(path.join(this.main.options.outputDir, fileOrDir), {recursive: true})
    }
  }

}
