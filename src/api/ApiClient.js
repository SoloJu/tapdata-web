import axios from 'axios'

let pretreatment = function (doc) {
  if (Array.isArray(doc)) {
    doc.forEach(v => pretreatment(v))
  } else if (doc && typeof doc === 'object') {
    Object.keys(doc).forEach(key => {
      if (doc[key] && doc[key]['$numberDecimal']) {
        doc[key] = Number(doc[key]['$numberDecimal']) || 0
      }
      if (typeof doc[key] === 'object') {
        pretreatment(doc[key])
      }
    })
  }
}
export default class {
  constructor(collectionName) {
    // 在不提供 open api 时，使用 collectionName 拼接请求地址
    this.url = this.getAPIServerUrl(`/api/v1/${collectionName}`)
    this.openAPI = null
    this.collections = null
    this.collection = null
    this.uri = `${location.protocol}//${location.hostname}:3080`
    this.apiServer = null
  }

  setApiServer(apiServer) {
    this.apiServer = apiServer
    this.uri = this.apiServer.clientURI
    delete window.__api_server_token
  }

  getAPIServerUrl(path) {
    return `${this.uri || ''}${path || ''}`
  }

  /**
   * set collection
   * */
  setCollection(collection) {
    if (collection) {
      // this.url = this.getAPIServerUrl(`/api/v1/${collection.collection}`)
      this.collection = collection
    }
  }
  async getAPIServerToken() {
    if (window.__api_server_token) {
      return window.__api_server_token
    }

    let clientInfo = await axios.get('/api/Applications', {
      params: {
        // 'filter[where][clientName]': 'Data Explorer'
        filter: JSON.stringify({
          where: {
            clientName: 'Data Explorer'
          }
        })
      }
    })
    clientInfo = clientInfo.data[0] || {}
    // let scope = clientInfo.scopes && clientInfo.scopes[0] ? clientInfo.scopes[0] : 'All_publish_data'
    // let username = decodeURIComponent(document.cookie.match(/(^|)email=([^;]*)(;|$)/)[2])
    let data = 'grant_type=client_credentials&client_id=' + clientInfo.id + '&client_secret=' + clientInfo.clientSecret

    const result = await axios.create().post('/oauth/token', data)

    window.__api_server_token = result.data.access_token

    setTimeout(function () {
      delete window.__api_server_token
    }, 1000 * 60 * 5)

    return window.__api_server_token
  }

  /**
   * load open api json
   * @returns {Promise<*>}
   */
  async loadOpenAPI() {
    try {
      let openAPIUrl = this.getAPIServerUrl('/openapi.json')
      let response = await axios.create().get(openAPIUrl)
      if (response && response.data) {
        this.openAPI = response.data
        this.collections = await this.parseOpenAPI(this.openAPI)
        return {
          success: true,
          data: this.collections
        }
      } else {
        return {
          success: false,
          status: response.status
        }
      }
    } catch (e) {
      // if (console && console.error) {
      //   console.error('parse OpenAPI.json error', e)
      // }
      return {
        success: false,
        status: 'default'
      }
    }
  }

  /**
   * 解析 json
   */
  async parseOpenAPI(openAPI) {
    if (openAPI && openAPI.paths) {
      const server = this.getAPIServerUrl('')
      // const server = openAPI['servers'] && openAPI['servers'].length > 0 && openAPI['servers'][0]['url'] ? openAPI['servers'][0]['url'] : this.getAPIServerUrl('')
      const paths = Object.keys(openAPI.paths || {})
      const collections = {}
      paths.forEach(path => {
        let methods = Object.keys(openAPI.paths[path] || {})
        methods.forEach(method => {
          const methodDesc = openAPI.paths[path][method]
          const collection = methodDesc.tags ? methodDesc.tags[0] : ''
          const operationName = methodDesc['x-operation-name']
          const tableName = methodDesc['x-table-name']
          const apiId = methodDesc['x-api-id']
          const apiName = methodDesc['x-api-name']
          const fields = methodDesc['x-fields']

          if (collection && methodDesc['responses']) {
            collections[collection] = collections[collection] || {
              api: {},
              properties: {},
              tableName: tableName,
              apiId: apiId,
              apiName: apiName
            }
            collections[collection]['api'][operationName] = {
              url: server + path,
              method: method,
              fields: fields
            }

            if (
              operationName === 'findPage' ||
              operationName === 'findPage_post' ||
              (operationName !== 'findPage_post' && operationName.startsWith('findPage_'))
            ) {
              let $ref =
                methodDesc['responses']['200']['content']['application/json']['schema']['properties']['data']['items'][
                  '$ref'
                ]
              let modelPath = $ref.split('/')
              let model = openAPI['components']['schemas'][modelPath[modelPath.length - 1]]
              collections[collection]['properties'] = model.properties
            }
          }
        })
      })
      // console.log(collections)
      return collections
    }
  }

  async getHeaders(collectionName, operationName) {
    let collection = this.collections[collectionName || this.collection.collection]
    let properties = collection['properties']
    let headers = []
    let fields = Object.keys(properties || {})
    fields.forEach(field => {
      headers.push({
        text: field,
        value: field,
        show: true,
        type: properties[field]['type'],
        format: properties[field]['format']
      })
    })
    let showFields = {}
    if (operationName) {
      showFields = (collection.api[operationName] && collection.api[operationName]['fields']) || {}
      if (showFields && Object.keys(showFields || {}).length > 0) {
        headers = headers.filter(v => !!showFields[v.value])
      }
    }
    return headers
  }

  /* async get (params) {
    const request = axios.create({headers: {token: await this.getAPIServerToken()}})
    if (params.url) {
      let url = params.url
      delete params.url
      return request.get(url, {params})
    }
    params = params || {}
    return request.get(this.url, {params})
  } */

  async exportData(params) {
    const token = await this.getAPIServerToken()
    params = params || {}
    let url = this.collections[this.collection.collection]['api']['findPage']['url']
    let fileExp = params.type === 'excel' ? 'xlsx' : params.type || 'json'
    let queryString = []
    Object.keys(params || {}).forEach(v => {
      queryString.push(v + '=' + params[v])
    })
    queryString.push('access_token=' + token)
    queryString.push('filename=' + this.collection.collection + '.' + fileExp)
    url = url + '?' + queryString.join('&')
    window.open(url, '__target')
  }

  async downloadById(item) {
    const token = await this.getAPIServerToken()
    let url = this.collections[this.collection.collection]['api']['downloadById']['url']
    url = url.replace('{id}', item._id)
    url = url + '?access_token=' + token
    window.open(url, '__target')
  }

  // 查询列表
  async find(params) {
    try {
      if (!this.collections || !this.collection) {
        return {
          success: true,
          status: 200,
          data: {
            data: [],
            total: {
              count: 0
            }
          }
        }
      }
      const request = axios.create({
        headers: { access_token: await this.getAPIServerToken() }
      })
      params = params || {}
      let url = ''
      if (
        this.collections[this.collection.collection] &&
        this.collections[this.collection.collection]['api'] &&
        this.collections[this.collection.collection]['api'][this.collection.operationName || 'findPage_post']
      ) {
        url =
          this.collections[this.collection.collection]['api'][this.collection.operationName || 'findPage_post']['url']
      }
      if (!url) {
        return {
          success: false,
          response: 'Not found API',
          msg: 'Not found API'
        }
      }
      const response = await request.post(url, params)
      if (response.statusText === 'OK') {
        if (response.data && response.data.data && response.data.data.length > 0) {
          response.data.data.forEach(doc => pretreatment(doc))
        }
        return {
          status: 200,
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          response: response
        }
      }
    } catch (e) {
      return {
        success: false,
        response: e.response,
        msg: e.message
      }
    }
  }

  async create(doc) {
    try {
      const request = axios.create({
        headers: { access_token: await this.getAPIServerToken() }
      })
      let url = this.collections[this.collection.collection]['api']['create']['url']
      const response = await request.post(url, doc)
      if (response.statusText === 'OK') {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          response: response
        }
      }
    } catch (e) {
      return {
        success: false,
        response: e.response,
        msg: e.message
      }
    }
  }

  // 根据id更新单条数据
  async updateById(id, doc) {
    try {
      pretreatment(doc)
      const request = axios.create({
        headers: { access_token: await this.getAPIServerToken() }
      })
      let url = this.collections[this.collection.collection]['api']['updateById']['url']
      url = url.replace('{id}', id)
      const response = await request.patch(url, doc)
      if (response.statusText === 'OK') {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          response: response
        }
      }
    } catch (e) {
      return {
        success: false,
        response: e.response,
        msg: e.message
      }
    }
  }

  async updateone(id, doc) {
    try {
      pretreatment(doc)
      const request = axios.create({
        headers: { access_token: await this.getAPIServerToken() }
      })
      let url = this.collections[this.collection.collection]['api']['updateById']['url']
      url = url.replace('{id}', id)
      const response = await request.patch(url, doc)
      if (response.statusText === 'OK') {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          response: response
        }
      }
    } catch (e) {
      return {
        success: false,
        response: e.response,
        msg: e.message
      }
    }
  }

  // 删除行
  async deleteById(id) {
    try {
      const request = axios.create({
        headers: { access_token: await this.getAPIServerToken() }
      })
      let url = this.collections[this.collection.collection]['api']['deleteById']['url']
      url = url.replace('{id}', id)
      const response = await request.delete(url)

      if (response.statusText === 'OK') {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          response: response
        }
      }
    } catch (e) {
      return {
        success: false,
        response: e.response,
        msg: e.message
      }
    }
  }

  // 批量更新
  async updateAll(where, data) {
    try {
      where = where || {}

      const request = axios.create({
        headers: { access_token: await this.getAPIServerToken() }
      })
      let url = this.collections[this.collection.collection]['api']['updateAll']['url']
      let querys = []
      Object.keys(where).forEach(key => {
        querys.push(`${key}=${where[key]}`)
      })
      url = url + '?' + querys.join('&')

      const response = await request.patch(url, data)
      if (response.statusText === 'OK') {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          response: response
        }
      }
    } catch (e) {
      return {
        success: false,
        response: e.response,
        msg: e.message
      }
    }
  }
}
