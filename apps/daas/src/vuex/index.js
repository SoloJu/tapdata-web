import * as Vue from 'vue'
import * as Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import dataflow from '@tap/dag/src/store'
import classification from '@tap/component/src/store'
import overView from '@tap/ldp/src/store'
import feature from './modules/feature'

const store = Vuex.createStore({
  // 全局变量
  state: {
    notification: {
      unRead: 0,
    },
  },
  actions,

  mutations,

  modules: {
    dataflow,
    classification,
    overView,
    feature,
  },
})

export default store
