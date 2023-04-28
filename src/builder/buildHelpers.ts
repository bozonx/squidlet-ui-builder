import path from 'node:path';
import {exec} from 'node:child_process';
import fs from 'node:fs/promises';
import yaml from 'yaml';
import _ from 'lodash';
import {mkdirPLogic} from 'squidlet-lib'
import {BuilderMain} from './BuilderMain.js';
import {ExecOptions} from 'child_process';


export async function loadYamlFile(filePath: string): Promise<any> {
  const fileContentStr = await fs.readFile(filePath, 'utf8')

  return yaml.parse(fileContentStr)
}

export async function loadPrjYamlFile(main: BuilderMain, subDir: string, fileName: string): Promise<any> {
  const fullFileName = path.join(main.options.prjDir, subDir, fileName)

  return loadYamlFile(fullFileName)
}

export async function applyTemplate(tmplPath: string, data: Record<string, any>): Promise<string> {
  const tmplStr = await fs.readFile(tmplPath, 'utf8')

  return _.template(tmplStr)(data)
}

export async function mkdirP (dirName: string){
  return mkdirPLogic(
    dirName,
    async (pathTo: string) => fileExists(pathTo),
    (pathTo: string) => fs.mkdir(pathTo)
  )
}

export async function fileExists(pathTo: string): Promise<boolean> {
  try {
    await fs.lstat(pathTo)

    return true
  }
  catch (e) {
    return false
  }
}

export async function simpleExec(cmd: string, cwd?: string) {
  return new Promise<void>((resolve, reject) => {
    exec(
      cmd,
      { cwd },
      (error, stdout, stderr) => {
        if (error) return reject(error)

        console.log(stdout)
        resolve()
      }
    )
  })
}
