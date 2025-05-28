export interface Translator {
  translateProject: (schemas: string[]) => string
}