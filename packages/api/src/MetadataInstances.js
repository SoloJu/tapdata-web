import Http from './Http'
import { isPlainObj } from '@tap/shared'

export default class MetadataInstances extends Http {
  constructor() {
    super('/api/MetadataInstances')
  }
  getId(id, params) {
    return this.axios.get(this.url + '/' + id, { params })
  }
  patchId(id, params) {
    return this.axios.patch(this.url + '/' + id, params)
  }
  classification(params) {
    return this.axios.patch(this.url + '/classifications', params)
  }
  download(where, type) {
    if (typeof where === 'object') where = JSON.stringify(where)
    window.open(this.url + `/download?where=${encodeURIComponent(where)}&type=${type}`)
    // return this.axios.get(this.url + '/download?where=' + where);
  }

  dataMap(params) {
    return this.axios.get(this.url + '/dataMap', { params })
  }
  schema(params) {
    return this.axios.get(this.url + '/schema', { params })
  }
  tableConnection(params) {
    return this.axios.get(this.url + '/tableConnection', { params })
  }
  upload(upsert, type, listtags, params) {
    return this.axios.post(`${this.url}/upload?upsert=${upsert}&type=${type}&listtags=${listtags}`, params)
  }
  search(params) {
    return this.axios.get(this.url + '/search', { params })
  }
  compareHistory(id, params) {
    return this.axios.get(this.url + '/compareHistory?id=' + id, params)
  }

  /**
   * 获取节点schema
   * @param nodeId
   * @param fields 筛选字段，如果有值，则请求结果只返回fields包含的字段；类型：字符串数组
   * @returns {Promise<AxiosResponse<any>>}
   */
  nodeSchema(nodeId, fields = ['fields']) {
    return this.axios.get(this.url + '/node/schema', {
      params: {
        nodeId,
        fields
      }
    })
  }

  /**
   * 获取元数据表
   */
  originalData(qualified_name, target) {
    if (target) {
      return this.axios.get(this.url + '/originalData?qualified_name=' + encodeURIComponent(qualified_name) + target)
    } else return this.axios.get(this.url + '/originalData?qualified_name=' + encodeURIComponent(qualified_name))
  }

  get(params = {}, filter) {
    if (Array.isArray(params)) {
      filter = typeof filter === 'object' ? JSON.stringify(filter) : filter
      let qs = filter ? '?filter=' + encodeURIComponent(filter) : ''
      return this.axios.get(this.url + '/' + params.join('/') + qs)
    }
    const config = { params }
    if (isPlainObj(filter)) {
      Object.assign(config, filter)
    }
    return this.axios.get(this.url, config)
  }

  getTables(connectionId) {
    return this.axios.get(this.url + '/tables?connectionId=' + connectionId)
  }

  getSourceTables(connectionId) {
    return this.axios.get(this.url + '/tables?connectionId=' + connectionId + '&sourceType=SOURCE')
  }

  getSourceTables(connectionId) {
    return this.axios.get(this.url + '/tables?connectionId=' + connectionId + '&sourceType=SOURCE')
  }

  /**
   * 主从合并获取父节点字段
   * @param taskId
   * @param nodeId
   * @returns {Promise<AxiosResponse<any>>}
   */
  getMergerNodeParentFields(taskId, nodeId) {
    return this.axios.get(`${this.url}/mergerNode/parent/fields?taskId=${taskId}&nodeId=${nodeId}`)
  }
  findTablesById(id) {
    return this.axios.get(this.url + '/findTablesById/' + id)
  }
  findInspect(data) {
    return this.axios.post(this.url + '/findInspectPost', data)
  }
}
export { MetadataInstances }
