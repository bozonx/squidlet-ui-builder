import {BuilderMain} from './builder/BuilderMain.js'

(async () => {
  // TODO: get from param
  const builder = new BuilderMain({
    prjDir: './ui',
    prjName: 'some-project',
  })

  await builder.init()
  await builder.build()
})()
