const Router = require('koa-router')
const router = new Router()



const main = ctx => {
  let data = {title: '标题'}
  ctx.render('home', data)
}

router.get('/', main)

module.exports = router
