import axios from './axios'
import PublicApi from './PublicApi'
export class MetadataInstances extends PublicApi {
  constructor() {
    super('/api/MetadataInstances')
  }
  getId(id, params) {
    return axios.get(this.url + '/' + id, { params })
  }
  patch(id, params) {
    return axios.patch(this.url + '/' + id, params)
  }
  classification(params) {
    return axios.patch(this.url + '/classifications', params)
  }
  download(where, type) {
    if (typeof where === 'object') where = JSON.stringify(where)
    window.open(this.url + `/download?where=${encodeURIComponent(where)}&type=${type}`)
    // return axios.get(this.url + '/download?where=' + where);
  }

  dataMap(params) {
    return axios.get(this.url + '/dataMap', { params })
  }
  schema(params) {
    return axios.get(this.url + '/schema', { params })
  }
  tableConnection(params) {
    return axios.get(this.url + '/tableConnection', { params })
  }
  upload(upsert, type, listtags, params) {
    return axios.post(`${this.url}/upload?upsert=${upsert}&type=${type}&listtags=${listtags}`, params)
  }
  search(params) {
    return axios.get(this.url + '/search', { params })
  }
  compareHistory(id, params) {
    return axios.get(this.url + '/compareHistory?id=' + id, params)
  }

  /**
   * 获取节点schema
   * @param nodeId
   * @param fields 筛选字段，如果有值，则请求结果只返回fields包含的字段；类型：字符串数组
   * @returns {Promise<AxiosResponse<any>>}
   */
  nodeSchema(nodeId, fields = ['fields']) {
    return axios.get(this.url + '/node/schema', {
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
      return axios.get(this.url + '/originalData?qualified_name=' + encodeURIComponent(qualified_name) + target)
    } else return axios.get(this.url + '/originalData?qualified_name=' + encodeURIComponent(qualified_name))
  }
}
