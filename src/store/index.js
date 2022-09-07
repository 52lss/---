import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tokenObj: {}
  },
  getters: {},
  mutations: {
    // token为传入的参数
    SET_TOKEN(state, token) {
      state.tokenObj = token
    }
  },
  actions: {},
  modules: {}
})
