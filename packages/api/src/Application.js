import Http from './http'

export default class Applications extends Http {
  constructor() {
    super('/api/Applications')
  }

  delete(id, name) {
    // return axios.delete(`${this.url}/${id}`)
    if (name == '') {
      return axios.delete(`${this.url}/${id}`)
    } else {
      return axios.delete(`${this.url}/${id}?name=${name}`)
    }
  }

  findOne(params) {
    params = params || {}
    return axios.get(this.url + '/findOne', { params })
  }
}

export { Applications }
