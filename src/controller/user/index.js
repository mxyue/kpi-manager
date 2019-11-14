const User = require('../../model/user')
const UserService = require('../../service/user')

class Controller {
  static async RenderList(ctx){
    await UserService.SyncUsers()
    let users = await User.find({}).sort({createdAt: -1}).lean()
    ctx.body = users
    // ctx.render('user/list', {users, title: '标题'})
  }
}

module.exports = Controller