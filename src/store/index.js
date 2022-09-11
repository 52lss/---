import Vue from 'vue'
import Vuex from 'vuex'

// vuex-persistedstate  数据持久化
import createpersistedstate from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  // 配置项
  // key：默认值是vuex
  // storage:默认值是本地存储
  // reducer: 指定持久化那些数据，函数，return一个对线，对象就作为存储的value
  // -参数state
  plugins: [
    createpersistedstate({
      key: 'vuex',
      // storage: window.sessionStorage
      reducer({ tokenObj }) {
        return { tokenObj }
      }
    })
  ],
  state: {
    // tokenObj: JSON.parse(window.localStorage.getItem('TOUBIAO_TOKEN')) || {}
    tokenObj: {},
    a: 1
  },
  getters: {
    // 判断是否有token 用于渲染登录前后的数据的判断
    isLogin(state) {
      return !!state.tokenObj.token
    }
  },
  mutations: {
    // token为传入的参数
    SET_TOKEN(state, token) {
      // 将token存到本地
      state.tokenObj = token
      // window.localStorage.setItem('TOUBIAO_TOKEN', JSON.stringify(token))
    }
  },
  actions: {},
  modules: {}
})
