import {BuilderMain} from './builder/BuilderMain.js'

(async () => {
  const builder = new BuilderMain({
    prjDir: './src/uiSchema',
    outputDir: './_build'
  })

  // TODO: get from param
  await builder.build()
})()
