// 下载axios
// 引入axios
// 配置axios
import axios from 'axios'
// axios.defaults.baseURL = 'http://toutiao.itheima.net'
// axios.timeout = 3000

// const request = axios.create()  克隆  用于项目存在多个基准地址 使用克隆用克隆出来的axios 进行配置
const request = axios.create({
  timeout: 5000,
  baseURL: 'http://toutiao.itheima.net'
})
export default request
