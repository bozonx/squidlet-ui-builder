export const SVELTE_EXT = '.svelte'
export const CODE_EXT = '.js'
export const YAML_EXT = '.yaml'
export const FILE_NAMES = {
  routes: 'routes',
  cfg: 'cfg'
}
export const ROOT_DIRS = {
  app: 'app',
  screens: 'screens',
  schemas: 'schemas',
  components: 'components',
  elements: 'elements',
  layouts: 'layouts',
  resources: 'resources',
}

export type Frameworks = 'svelte'

export const FRAMEWORKS: Record<Frameworks, Frameworks> = {
  svelte: 'svelte'
}
