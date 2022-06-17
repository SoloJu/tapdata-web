import Http from './Http'

export default class DataFlowInsights extends Http {
  constructor() {
    super('/api/DataFlowInsights')
  }

  runtimeMonitor(params) {
    return this.axios.get(this.url + '/runtimeMonitor', params)
  }
}
export { DataFlowInsights }
