import {Frameworks} from './constants.js';


export interface BuilderOptions {
  prjDir: string
  outputDir: string
  prjName: string
  framework: Frameworks
  // force full rebuild
  force: boolean
  componentLibPaths: string[]
}
