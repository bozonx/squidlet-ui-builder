import {BuilderMain} from './builder/BuilderMain.ts'

(async () => {
  // TODO: get from param
  const builder = new BuilderMain({
    prjDir: './ui',
    prjName: 'some-project',
  })

  await builder.init()
  await builder.build()
})()
