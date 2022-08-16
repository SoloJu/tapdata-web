import Http from './Http'
import { isPlainObj } from '@tap/shared'
export default class Discovery extends Http {
  constructor() {
    super('/api/discovery')
  }
  list(params) {
    const config = { params }
    if (isPlainObj(params)) {
      Object.assign(config, params)
    }
    return this.axios.get(this.url, config)
  }
  overView(id: string) {
    return this.axios.get(`${this.url}/storage/overview/${id}`)
  }
  preview(id: string) {
    return this.axios.get(`${this.url}/storage/preview/${id}`)
  }
  filterList(filterType) {
    return this.axios.get(`${this.url}/filterList?filterType=${filterType}`)
  }
  discoveryList(params) {
    const config = { params }
    if (isPlainObj(params)) {
      Object.assign(config, params)
    }
    return this.axios.get(`${this.url}/directory/data`, config)
  }
  postTags(params) {
    return this.axios.post(`${this.url}/tags`, params)
  }
  patchTags(params) {
    return this.axios.patch(`${this.url}/tags`, params)
  }
}
export { Discovery }
