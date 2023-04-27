import Koa from 'koa'
import path from 'node:path';
import * as fs from 'node:fs/promises';


const app = new Koa();


const relSrcDirPath = process.argv[2]

if (!relSrcDirPath) {
  throw new Error(`Specify source dir path please`)
}

const absDirPath = path.resolve(process.cwd(), relSrcDirPath)


app.use(async (ctx, next) => {

  // console.log(
  //   222,
  //
  //   //ctx.req.url,
  //   //ctx.request.href,
  //   ctx.request.path,
  //   //ctx.request.querystring,
  //   //ctx.request.search,
  //   //ctx.request.URL,
  //   //ctx.request.type,
  //   //ctx.request.charset,
  //   ctx.request.query,
  //   //ctx.is('application/json'),
  // )

  if (ctx.req.method === 'GET' && ctx.request.path === '/loadFile' && ctx.request.query.file) {
    ctx.response.type = 'application/json'

    // TODO: лучше ограничить доступ наверх
    const filePath = path.join(absDirPath, ctx.request.query.file as string)
    let fileContentStr: string

    try {
      fileContentStr = await fs.readFile(filePath, 'utf8')
    }
    catch (e) {
      ctx.body = JSON.stringify({
        error: {
          message: `Can't load a file: ${e}`
        }
      })
      ctx.response.status = 404

      return
    }

    ctx.body = JSON.stringify({
      result: fileContentStr
    })
    ctx.response.status = 200
  }
  if (ctx.req.method === 'GET' && ctx.request.path === '/loadDir' && ctx.request.query.dir) {
    ctx.response.type = 'application/json'

    // TODO: лучше ограничить доступ наверх
    const dirPath = path.join(absDirPath, ctx.request.query.dir as string)
    let dirs: string[]

    try {
      dirs = await fs.readdir(dirPath, 'utf8')
    }
    catch (e) {
      ctx.body = JSON.stringify({
        error: {
          message: `Can't load a dir: ${e}`
        }
      })
      ctx.response.status = 404

      return
    }

    ctx.body = JSON.stringify({
      result: dirs
    })
    ctx.response.status = 200
  }
  else {
    ctx.body = JSON.stringify({
      error: {
        message: 'Wrong url'
      }
    })
    ctx.response.status = 404
  }
});

app.listen(3000)
