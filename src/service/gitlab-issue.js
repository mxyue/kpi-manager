const request = require('request-promise')
const config = require('config')

const {host: gitHost,  privateToken} = config.get('gitlab')

function buildPagination(headers){
  return {
    nextPage: headers['x-next-page'],
    page: headers['x-page'],
    perPage: headers['x-per-page'],
    total: headers['x-total'],
    totalPage: headers['x-total-pages'],
  }
}

class Service {

  static async GetIssues(projectId, filter) {
    let res = await request({
      uri: `${gitHost}/api/v4/projects/${projectId}/issues?scope=all`,
      method: 'GET',
      qs: filter,
      headers: {
        'PRIVATE-TOKEN': privateToken,
      },
      resolveWithFullResponse: true,
    })
    let pageInfo = buildPagination(res.headers)
    return {issues: JSON.parse(res.body), pageInfo}
  }

  static async IterateIssues(projectId, filter, callback) {
    let doNext = true
    let page = '1'
    do{
      filter.page = page
      // log('filter-->', filter)
      let {pageInfo, issues} = await this.GetIssues(projectId, filter)

      if(typeof callback == 'function'){
        let result = callback.call(this, issues)
        // log('-result->', result)
        if(result instanceof Promise){
          let presult = await result
          // log('promise result>', result)
        }
      }

      if(pageInfo.page == pageInfo.totalPage){
        doNext = false
      }else{
        page = pageInfo.nextPage
      }
    }while(doNext)
  }

  static async CreateIssue(projectId, data) {

    let res = await request({
      uri: `${gitHost}/api/v4/projects/${projectId}/issues`,
      method: 'POST',
      body: data,
      headers: {
        'PRIVATE-TOKEN': privateToken
      },
      json: true,
    })

    return res
  }

  static async UpdateIssue(projectId, iid, data) {
    let res = await request({
      uri: `${gitHost}/api/v4/projects/${projectId}/issues/${iid}`,
      method: 'PUT',
      body: data,
      headers: {
        'PRIVATE-TOKEN': privateToken
      },
      json: true,
    })

    return res
  }

  static async RemoveIssue(gitlab) {
    let res = await request({
      uri: `${gitHost}/api/v4/projects/${gitlab.pid}/issues/${gitlab.iid}`,
      method: 'DELETE',
      headers: {
        'PRIVATE-TOKEN': privateToken
      },
    })
    return res
  }

}

module.exports = Service