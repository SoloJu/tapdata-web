import Http from './Http'

export default class SharedCacheAPI extends Http {
  constructor() {
    super('/api/shareCache')
  }
  findOne(id) {
    return this.axios.get(`${this.url}/${id}`)
  }
  patch(params) {
    return this.axios.patch(`${this.url}/${params.id}`, params)
  }
}
export { SharedCacheAPI }
