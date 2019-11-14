const Router = require('koa-router')
const hookApi = require('./hook')

const options = {
  prefix: '/api'
}

const router = new Router(options)

router.post('/hook/:id', hookApi.process)

module.exports = router
