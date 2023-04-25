import {BuilderMain} from './builder/BuilderMain.js'

(async () => {
  // TODO: get from param
  const builder = new BuilderMain({
    prjDir: './src/uiSchema',
    outputDir: './_build',
    prjName: 'some-project',
  })

  await builder.init()
  await builder.build()
})()
