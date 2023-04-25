import {BuilderMain} from './builder/BuilderMain.js'

(async () => {
  const builder = new BuilderMain()

  // TODO: get from param
  await builder.build('./src/uiSchema')
})()
