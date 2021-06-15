/**
 * @author lg<lirufei0808@gmail.com>
 * @date 3/11/20
 * @description
 */
import PublicApi from './publicApi'
import axios from 'axios'
export default class MetadataInstancesAPI extends PublicApi {
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
    window.open(
      this.url + `/download?where=${encodeURIComponent(where)}&type=${type}`
    )
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
    return axios.post(
      `${this.url}/upload?upsert=${upsert}&type=${type}&listtags=${listtags}`,
      params
    )
  }
  search(params) {
    return axios.get(this.url + '/search', { params })
  }
  compareHistory(id, params) {
    return axios.get(this.url + '/compareHistory?id=' + id, params)
  }
}
