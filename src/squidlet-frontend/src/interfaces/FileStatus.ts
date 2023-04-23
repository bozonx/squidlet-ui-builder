export interface FileStatus {
  // first time loaded
  loaded: boolean
  // if file exist. Null means not initialized
  exists: boolean | null
}
