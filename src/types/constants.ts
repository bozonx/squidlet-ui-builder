export const SVELTE_EXT = '.svelte'
export const CODE_EXT = '.js'
export const YAML_EXT = '.yaml'
// TODO: может в какой-то конфиг сохранить ???
export const DEFAULT_BUILD_DIR = './_build'
export const FILE_NAMES = {
  routes: 'routes',
  cfg: 'cfg'
}
export const ROOT_DIRS = {
  app: 'app',
  // system files and libs
  lib: 'lib',
  screens: 'screens',
  schemas: 'schemas',
  components: 'components',
  componentLibs: 'componentLibs',
  elements: 'elements',
  layouts: 'layouts',
  resourcesTmpl: 'resourcesTmpl',
}

export type Frameworks = 'svelte'

export const FRAMEWORKS: Record<Frameworks, Frameworks> = {
  svelte: 'svelte'
}
