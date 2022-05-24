import Http from './http'

export class CustomNode extends Http {
  constructor() {
    super('/api/customNode')
  }
  /**
   * 检查使用该节点的任务
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  checkUsed(id) {
    return this.axios.get(`${this.url}/checkUsed/${id}`).then(this.useData)
  }
}
