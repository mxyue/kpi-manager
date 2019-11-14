const Item = require('../../model/item')
const User = require('../../model/user')
const UserService = require('../../service/user')
const ItemService = require('../../service/item')
const ProjectService = require('../../service/project')



class Controller {
  
  static async RenderHome(ctx){
    ctx.redirect('/items')
  }

  static async RenderList(ctx){
    let items = await ItemService.GetItemsWithInfo()
    ctx.render('item/list', {items, title: '标题'})
  }

  // static async RenderShow(ctx){
  //   let itemId = ctx.params.id 
  //   let item = await Item.findOne({_id: itemId}).lean()
  //   item = buildItem(item)
  //   ctx.render('item/show', {item, title: '详情'})
  // }

  static async RenderEdit(ctx){
    let itemId = ctx.params.id 
    let item = await ItemService.GetDetailData(itemId)
    let users = await UserService.GetValidUsers()
    ctx.render('item/edit', {item, users, title: '编辑'})
  }

  static async Update(ctx){
    let itemId = ctx.params.id 
    await ItemService.UpdateByID(itemId, ctx.request.body)
    ctx.redirect(`/items/${itemId}/edit`)
  }

  static async RenderNew(ctx){
    let users = await UserService.GetValidUsers()
    let projects = await ProjectService.GetValidProjects()
    ctx.render('item/new', {users, projects, title: '新建'})
  }

  static async Create(ctx){
    let result = await ItemService.CreateItem(ctx.request.body)
    ctx.redirect('/items')
  }

  static async Delete(ctx){
    let itemId = ctx.params.id
    let removeFromGit = ctx.query.removeFromGit == 'true'
    await ItemService.DeleteItem(itemId)
    ctx.redirect('/items')
  }
}

module.exports = Controller