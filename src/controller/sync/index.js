const ProjectService = require('../../service/project')
const ItemService = require('../../service/item')

class Controller {
  static async Sync(ctx){
    let projectNids = await ProjectService.SyncProjects()
    for(let pid of projectNids){
      await ItemService.SyncItems(pid, {labels: '后端B组'})
    }
    // await ItemService.SyncItems(73, {labels: '后端B组'})
    ctx.body = 'ok'
  }

}

module.exports = Controller