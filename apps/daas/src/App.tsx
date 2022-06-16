import { defineComponent, provide } from '@vue/composition-api'
import { WorkerAPI } from '@tap/api'

export default defineComponent({
  render() {
    provide('checkAgent', async cb => {
      const workerApi = new WorkerAPI()
      const data = await workerApi.getAvailableAgent()
      if (!data?.result?.length) {
        this.$message.error(this.$t('agent_check_error'))
      } else {
        cb && cb()
      }
    })
    return (
      <div id="app">
        <router-view />
      </div>
    )
  }
})
