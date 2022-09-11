// 下载axios
// 引入axios
// 配置axios
import axios from 'axios'
import store from '@/store'

// axios.defaults.baseURL = 'http://toutiao.itheima.net'
// axios.timeout = 3000

// const request = axios.create()  克隆  用于项目存在多个基准地址 使用克隆用克隆出来的axios 进行配置
const request = axios.create({
  timeout: 5000,
  baseURL: 'http://toutiao.itheima.net'
})

// 请求拦截器
// config是每一次请求的配置
request.interceptors.request.use(
  function (config) {
    // 每次发请求都会执行
    // 在发请求之前做什么操作
    // 登录后，所有请求加上Authorization
    const {
      getters: { isLogin },
      state: { tokenObj }
    } = store
    if (isLogin) {
      config.headers.Authorization = `Bearer ${tokenObj.token}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
export default request
