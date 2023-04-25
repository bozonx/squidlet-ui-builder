import {BuilderMain} from './builder/BuilderMain.js'

(async () => {
  // TODO: get from param
  const builder = new BuilderMain({
    prjDir: './src/uiSchema',
    outputDir: './_build'
  })

  await builder.init()
  await builder.build()
})()
