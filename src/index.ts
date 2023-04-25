import {BuilderMain} from './builder/BuilderMain.js'

(async () => {
  const builder = new BuilderMain('./src/uiSchema')

  // TODO: get from param
  await builder.build()
})()
