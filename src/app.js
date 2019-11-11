const Koa = require('koa')

const config = require('config')
const koaStatic = require('koa-static')
const path = require('path')
const render = require('koa-art-template')
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')
const api = require('./api')

require('./db/mongoose')

let app = new Koa()

global.log = function () {
  console.log.apply(this, arguments)
}
global._ = require('lodash')

// 使用ctx.body解析中间件
app.use(bodyParser())

render(app, {
  root: path.join(__dirname, 'view'),
  extname: '.art',
  debug: process.env.NODE_ENV !== 'production'
})

let publickPath = path.join(__dirname, '../public')
app.use(koaStatic(publickPath))

app.use(controller.routes())
app.use(api.routes())

module.exports = app