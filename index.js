import locale from './locale'
import baseComponents from './components/base'
import VConfirm from './components/base/v-confirm'
import FormBuilder from './components/form-builder'
import ConnectionTypeSelector from './components/connection-type-selector'
import ConnectionFormSelector from './components/connection-form'
import ConnectionTest from './components/ConnectionTest'
import FieldMapping from './components/FieldMapping'
import CheckStage from './components/CheckStage'

import WSClient from './plugins/ws-client'
import * as _util from './util'
import * as _const from './const'

const components = [ConnectionTypeSelector, ConnectionFormSelector, ConnectionTest, FieldMapping, CheckStage].concat(
  baseComponents
)

const install = Vue => {
  Vue.prototype.$util = _util
  Vue.prototype.$const = _const
  Vue.prototype.$confirm = (param1, param2, param3) => {
    return new Promise((resolve, reject) => {
      VConfirm.confirm(param1, param2, param3)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    }).catch(() => {})
  }

  Vue.use(FormBuilder)

  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.mixin({
    created() {
      // 创建实例时传入wsOptions，即可默认开启websocket
      let wsOptions = this.$options.wsOptions
      // 根实例才有ws
      if (wsOptions) {
        Vue.prototype.$ws = new WSClient(wsOptions.url, wsOptions.protocols, wsOptions)
      }
    }
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
const langs = locale
export default {
  install
}
export { langs, ConnectionTypeSelector, ConnectionFormSelector, ConnectionTest, WSClient, FieldMapping, CheckStage }
