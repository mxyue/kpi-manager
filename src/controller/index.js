const Router = require('koa-router')
const router = new Router()
const ItemController = require('./item')
const UserController = require('./user')
const SyncController = require('./sync')

// const main = ctx => {
//   let data = {title: '标题'}
//   ctx.render('home', data)
// }

router.get('/', ItemController.RenderHome)
router.get('/items', ItemController.RenderList)
router.post('/items', ItemController.Create)
router.get('/items/new', ItemController.RenderNew)
// router.get('/items/:id', ItemController.RenderShow)
router.get('/items/:id/edit', ItemController.RenderEdit)
router.post('/items/:id/edit', ItemController.Update)
router.get('/items/:id/delete', ItemController.Delete)

router.get('/users', UserController.RenderList)

router.get('/sync', SyncController.Sync)

module.exports = router
