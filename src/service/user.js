const config = require('config')
const {host: gitHost, privateToken} = config.get('gitlab')
const request = require('request-promise')
const User = require('../model/user')
const DBHelper = require('../db/helper')

function buildNewUser(user){
  let doc = _.pick(user, ['name', 'username', 'state'])
  doc.nid = user.id
  doc.avatarUrl = user.avatar_url
  return DBHelper.BuildBulkInsertOne(doc)
}

function buildUpdateUser(user){
  let doc = _.pick(user, ['name', 'username', 'state'])
  return DBHelper.BuildBulkUpdateOne({nid: user.id}, doc)
}

class Service{
  static async GetRemoteUsers(){
    let res = await request({
      uri: `${gitHost}/api/v4/users?per_page=100`,
      method: 'GET',
      headers: {'PRIVATE-TOKEN': privateToken},
    })
    return JSON.parse(res)
  }
  
  static async SyncUsers(){
    let remoteUsers = await this.GetRemoteUsers()
    let dbUsernames = await User.distinct('username',{}).lean()
    let bulkDocs = []
    for(let user of remoteUsers){
      if(dbUsernames.includes(user.username)){
        bulkDocs.push(buildUpdateUser(user))
      }else{
        bulkDocs.push(buildNewUser(user))
      }
    }
    let result = await User.bulkWrite(bulkDocs)
  }

  static async GetValidUsers(){
    return User.find({state: 'active'}).lean()
  }
}

module.exports = Service 