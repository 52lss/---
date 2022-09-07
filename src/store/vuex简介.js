import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用于储存数据
    // count: 0
    // 声明在state 里面
    // 取：通过this.store.state.count 获取count值
  },
  getters: {
    // 相当于computed计算属性
    // 使用：this.store.getters.big
    big(state) {
      return state.count * 10
    }
  },
  mutations: {
    // vuex修改数据 自产自销 只能在这里修改
    // 规范： 采用大驼峰命名法
    // 通过this.$store.commit(mutations里面的方法名字)  触发vuex里面mutations的方法
    // payload为传过来的参数
    SET_COUNT(state, payload) {
      state.count += payload
    }
  },
  actions: {},
  modules: {}
})
