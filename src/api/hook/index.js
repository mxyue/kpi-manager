const itemHelper = require('../../helper/item')
const Item = require('../../model/item')


class Hook{
  static async process(ctx){
    log('logs>', JSON.stringify(ctx.request.body))
    let data = ctx.request.body
    let itemDoc = itemHelper.build(data)
    let result = await Item.create(itemDoc)
    log('rr>', result)
    ctx.body = {success: true}
  }
}


module.exports = Hook