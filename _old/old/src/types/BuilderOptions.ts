import {Frameworks} from './constants.ts';


export interface BuilderOptions {
  prjDir: string
  outputDir: string
  prjName: string
  framework: Frameworks
  // force full rebuild
  force: boolean
  componentLibPaths: string[]
}
