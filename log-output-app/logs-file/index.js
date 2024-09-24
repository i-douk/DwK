const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const { consoleOutput } = require('../log-output')
const app = new Koa()
const PORT = process.env.PORT || 3003

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'logs.txt')

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false)
    return res(true)
  })
})

const saveToFile = async () => {
  if (await fileAlreadyExists() == false) {
    await new Promise(res => fs.mkdir(directory, (err) => res()))
  }
  
  await new Promise(res => fs.writeFile(filePath, JSON.stringify(consoleOutput), err => {
    console.log(consoleOutput.toString())
    if (err) {
      console.error(err);
    } else {
      res()
      console.log('log file was saved')
    }
  }))
}

const removeFile = async () => new Promise(res => fs.unlink(filePath, (err) => res()))

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return

  await removeFile()
  saveToFile()
  ctx.status = 200
});

console.log('Started')

saveToFile()

app.listen(PORT)