
const config = require('config')
const {host: gitHost, privateToken} = config.get('gitlab')
const Project = require('../model/project')
const request = require('request-promise')
const DBHelper = require('../db/helper')

function buildNewProject(data){
  let doc = _.pick(data, ['name', 'description'])
  doc.nid = data.id
  return DBHelper.BuildBulkInsertOne(doc)
}

function buildUpdateProject(data){
  let doc = _.pick(data, ['name', 'description'])
  return DBHelper.BuildBulkUpdateOne({nid: data.id}, doc)
}


class Service {
  static async GetRemoteProjects(){
    let res = await request({
      uri: `${gitHost}/api/v4/projects?per_page=100&simple=true`,
      method: 'GET',
      headers: {'PRIVATE-TOKEN': privateToken},
    })
    return JSON.parse(res)
  }

  static async SyncProjects(){
    let remoteProjects = await this.GetRemoteProjects()
    let dbProjectIds = await Project.distinct('nid',{}).lean()
    let bulkDocs = []
    let projectNids = []
    for(let project of remoteProjects){
      projectNids.push(project.id)
      if(dbProjectIds.includes(project.id)){
        bulkDocs.push(buildUpdateProject(project))
      }else{
        bulkDocs.push(buildNewProject(project))
      }
    }
    let result = await Project.bulkWrite(bulkDocs)
    return projectNids
  }

  static async GetValidProjects(){
    return Project.find({}).lean()
  }
}

module.exports = Service