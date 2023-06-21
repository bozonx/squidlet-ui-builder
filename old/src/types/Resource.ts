export interface Resource<Config = Record<string, any>> {
  configure(method: string, config: Config): Promise<void>
  load<SchemaItem>(params: Record<string, any>): Promise<void>
}
