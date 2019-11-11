const Router = require('koa-router')

const options = {
  prefix: '/api'
}
const router = new Router(options)

router.post('/test', async (ctx)=>{
  log('logs>',JSON.stringify(ctx.request.body))
  ctx.body = {success: true}
})

module.exports = router
