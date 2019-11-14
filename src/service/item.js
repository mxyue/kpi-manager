const Item = require('../model/item')
const GitlabIssueService = require('./gitlab-issue')
const DBHelper = require('../db/helper')


function _getIncScore(item){
  return item.due + item.complex || 0
}

function _getDecScore(item){
  return item.bug + item.test || 0
}

function _getOffsetScore(item){
  return item.codeReview || 0
}

function getTotalScore(item){
  return _getIncScore(item) - _getDecScore(item) + _getOffsetScore(item)
}


function buildItem(item){
  item.id = item._id.toString()
  item.incScore = _getIncScore(item)
  item.decScore = _getDecScore(item)
  item.offsetScore = _getOffsetScore(item)
  if(item.project){
    item.project = {name: item.project.name}
  }
  return item
}

function buildUpdateItem(data){
  let updata = _.pick(data, ['title','labels'])
  for( let key in data ){
    if(['due', 'complex', 'bug', 'test', 'codeReview', 'assigneeId'].includes(key)){
      updata[key] = Number(data[key]) || 0
    }
  }
  updata.score = getTotalScore(updata)
  return updata
}

function buildNewItem(data){
  let doc = _.pick(data, ['title', 'labels', 'gitlab'])
  for( let key in data ){
    if(['due','complex','assigneeId'].includes(key)){
      doc[key] = Number(data[key]) || 0
    }
  }
  doc.score = getTotalScore(doc)
  return doc 
}

function buildIssueInfoUpdateDoc(gitInfo){
  let pid = parseInt(gitInfo.project_id)
  let iid = parseInt(gitInfo.iid)
  let filter = {'gitlab.pid': pid, 'gitlab.iid': iid}
  let doc = _.pick(gitInfo, ['title', 'description'])
  doc.authorId = gitInfo.author.id
  doc.assigneeId = gitInfo.assignee && gitInfo.assignee.id
  doc.labels = gitInfo.labels.join(',')
  doc.gitlab = {pid, iid}
  doc.createdAt = gitInfo.created_at
  doc.closedAt = gitInfo.closed_at
  return DBHelper.BuildBulkUpdateOne(filter, doc, true)
}


class Service {
  static async GetItemsWithInfo(){
    let items = await Item.aggregate([
      {$match: {}},
      {$lookup: {from: 'users', localField: 'assigneeId', foreignField: 'nid', as: 'assignee'}},
      {$unwind: {path: '$assignee', preserveNullAndEmptyArrays: true }},
      {$sort: {createdAt: -1}}
    ])
    items = items.map(item =>{
      return buildItem(item)
    })

    return items
  }

  static async UpdateByID(itemId, data){
    let doc = buildUpdateItem(data)
    let item = await Item.findOneAndUpdate({_id: itemId}, {$set: doc}, {new: true})
    if (item.gitlab && item.gitlab.pid){
      let {pid, iid} = item.gitlab
      let gitDoc = {title: item.title, labels: item.labels, assignee_id: item.assigneeId}
      await GitlabIssueService.UpdateIssue(pid, iid, gitDoc)
    }
  }
 
  static async CreateItem(body){
    let res 
    if(body.projectId){
      let data = _.pick(body, ['title', 'labels'])
      data.assignee_id = body.assigneeId
      let res = await GitlabIssueService.CreateIssue(body.projectId, data)
      body.gitlab = {projectId: res.project_id, iid: res.iid}
      log('body.gitlab->', body.gitlab)
    }
    
    let data = buildNewItem(body)
    log('data->', data)
    return await Item.create(data)
  }

  static async GetDetailData(itemId){
    let item = await Item.findOne({_id: itemId}).populate('project').lean()
    item = buildItem(item)
    return item
  }

  static async DeleteItem(itemId, removeFromGit = false){
    let item = await Item.findById(itemId).lean()
    if(removeFromGit && item.gitlab && item.gitlab.pid){
      await GitlabIssueService.RemoveIssue(item.gitlab)
    }
    let result = await Item.remove({_id: itemId})
    log('remove>',result)
  }

  static async SyncItems(projectId, filter){

    await GitlabIssueService.IterateIssues(projectId, filter, async (issues) =>{
      let bulkDocs = issues.map(issue=>{
        return buildIssueInfoUpdateDoc(issue)
      })
      if(bulkDocs.length>0){
        await Item.bulkWrite(bulkDocs)
      }
      return
    })
  }
}

module.exports = Service