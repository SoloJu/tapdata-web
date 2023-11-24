import Http from './Http'
export default class Worker extends Http {
  constructor() {
    super('/api/Workers')
  }
  getAvailableAgent() {
    return this.axios.get(this.url + '/availableAgent')
  }

  taskUsedAgent(id) {
    return this.axios.get(this.url + '/available/taskUsedAgent?taskId=' + id)
  }

  unbindByProcessId(params) {
    return this.axios.post(`${this.url}/unbindByProcessId`, params)
  }
}
export { Worker }
