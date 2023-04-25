import path from 'node:path';
import fs from 'node:fs/promises';
import yaml from 'yaml';
import _ from 'lodash';
import {mkdirPLogic} from 'squidlet-lib';
import {BuilderMain} from '../builder/BuilderMain.js';


export async function loadYamlFile(main: BuilderMain, subDir: string, fileName: string): Promise<any> {
  const fullFileName = path.join(main.options.prjDir, subDir, fileName)
  const fileContentStr = await fs.readFile(fullFileName, 'utf8')

  return yaml.parse(fileContentStr)
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
