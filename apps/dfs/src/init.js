import * as Vue from 'vue'
import './plugins/element'
import './plugins/axios'
import './directive'
import App from './App.vue'
import * as VueRouter from 'vue-router'
import 'github-markdown-css'
import './assets/styles/app.scss'
import VueClipboard from 'vue-clipboard2'

import i18n from './i18n'
import store from '@/store'
import { errorConfirmFnc } from '@/util'
import VConfirm from '@/components/v-confirm'
import { startTimeOnSite, startTimeOnPage } from '@/plugins/buried'
import { VIcon, VButton } from '@tap/component'
import FormBuilder from '@tap/component/src/form-builder'
import { timeStampApi } from '@tap/api'
import Time from '@tap/shared/src/time'
import WSClient from '@tap/business/src/shared/ws-client'

window.$vueApp.use(VueClipboard)

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
window.$vueApp.use(FormBuilder)

window.$vueApp.component(VIcon.name, VIcon)
window.$vueApp.component(VButton.name, VButton)

window.$vueApp.mixin({
  created() {
    // 创建实例时传入wsOptions，即可默认开启websocket
    let wsOptions = this.$options.wsOptions
    // 根实例才有ws
    if (wsOptions) {
      window.$vueApp.config.globalProperties.$ws = new WSClient(wsOptions.url, wsOptions.protocols, wsOptions)
    }
  }
})

window.$vueApp.config.globalProperties.$confirm = (message, title, options) => {
  return new Promise((resolve, reject) => {
    VConfirm.confirm(message, title, options)
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  }).catch(() => {})
}

export default ({ routes }) => {
  let loading = null

  const init = () => {
    const router = VueRouter.createRouter({
      history: VueRouter.createWebHashHistory(),
      routes: routes
    })
    startTimeOnPage(router)

    var loc = window.location,
      wsUrl = 'ws://'
    if (loc.protocol === 'https:') {
      wsUrl = 'wss://'
    }
    let queryString = ``
    if (process.env.NODE_ENV === 'development') {
      queryString = `__token=${process.env.VUE_APP_ACCESS_TOKEN}`
    }
    wsUrl = wsUrl + loc.host + loc.pathname + `tm/ws/agent?${queryString}`
    window.App = {
      router,
      store,
      i18n,
      wsOptions: {
        url: wsUrl
      },
      render: h => h(App)
    }.$mount('#app')

    // 路由守卫
    router.beforeEach((to, from, next) => {
      let domainName = document.domain
      let removeReadonly = localStorage.getItem('removeReadonly')
      if (
        [
          'connectionCreate',
          'connectionsEdit',
          'DataflowNew',
          'DataflowEditor',
          'MigrateCreate',
          'MigrateEditor',
          'MigrateEditor'
        ].includes(to.name) &&
        domainName === 'demo.cloud.tapdata.net' &&
        !removeReadonly
      ) {
        next(false)
      } else {
        next()
      }
    })
    return router
  }
  loading = window.loading({ fullscreen: true })
  let count = 0

  let getData = () => {
    window.axios
      .get('api/tcm/user')
      .then(data => {
        let userInfo = data
        window.__USER_INFO__ = userInfo

        loading.close()
        init()

        // 设置服务器时间
        timeStampApi.get().then(t => {
          Time.setTime(t)
        })
      })
      .catch(err => {
        // 获取用户信息失败
        if (count < 4) {
          // eslint-disable-next-line
          console.log(i18n.t('dfs_src_init_huoquyonghuxin2'))
          setTimeout(() => {
            count++
            // eslint-disable-next-line
            console.log(i18n.t('dfs_src_init_chongxinchangshihuo')('dfs_src_init_chongxinchangshihuo', { val1: count }))
            getData()
          }, 3000)
        } else {
          // eslint-disable-next-line
          console.log(i18n.t('dfs_src_init_huoquyonghuxin'), err)
          loading.close()
          init()
          return errorConfirmFnc(err)
        }
      })
  }
  window.axios.get('config/config.json').then(res => {
    window.__config__ = res.data
    getData()
  })
}

startTimeOnSite()
