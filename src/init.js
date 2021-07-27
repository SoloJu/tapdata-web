import Vue from 'vue'
import './plugins/element'
import './plugins/axios'
import './plugins/monent'
import App from './App.vue'
import VueRouter from 'vue-router'
import './assets/app.scss'
import VueClipboard from 'vue-clipboard2'
import { Message } from 'element-ui'
import ElementLocale from 'element-ui/lib/locale'
import settings from './settings'
import TapdataWebCore, { langs } from '../packages/tapdata-web-core'
import VueI18n from 'vue-i18n'

require('./assets/theme/dfs/index.scss')

Vue.config.productionTip = false
Vue.prototype.$settings = settings
Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.use(TapdataWebCore)
Vue.use(VueI18n)
const i18n = new VueI18n({
  // locale: localStorage.lang || 'en',
  locale: 'zh-CN',
  messages: langs
})
ElementLocale.i18n((key, value) => {
  return i18n.t(key, value)
}) // 重点：为了实现element插件的多语言切换

Vue.prototype.$checkAgentStatus = callback => {
  window.axios.get('tm/api/Workers/availableAgent').then(data => {
    if (data?.result?.length) {
      callback && callback()
    } else {
      Message.error('Agent当前状态异常，请检查')
    }
  })
}

export default ({ routes }) => {
  const router = new VueRouter({
    routes
  })
  let loading = null
  router.beforeEach((to, from, next) => {
    next()
  })
  const init = () => {
    var loc = window.location,
      wsUrl = 'ws://'
    if (loc.protocol === 'https:') {
      wsUrl = 'wss://'
    }
    let preUrl = settings.DFS_TM_API_PRE_URL || ''
    wsUrl = wsUrl + loc.host + preUrl + `/ws/agent?X-Token=${window.__USER_INFO__.token}`
    window.App = new Vue({
      router,
      i18n,
      wsOptions: {
        url: wsUrl
      },
      render: h => h(App)
    }).$mount('#app')
  }
  loading = window.loading({ fullscreen: true })
  let count = 0
  let getData = () => {
    Promise.all([window.axios.get('api/tcm/user')])
      .then(([user]) => {
        let userInfo = user
        window.__USER_INFO__ = userInfo
        loading.close()
        init()
      })
      .catch(() => {
        if (count < 4) {
          setTimeout(() => {
            count++
            getData()
          }, 3000)
        } else {
          loading.close()
          init()
          location.replace(location.href.split('#/')[0] + '#/500')
        }
      })
  }
  getData()
}
sessionStorage.setItem('TM_CONFIG', JSON.stringify(settings))
