// import store from '@/store'
// 根据后端接口文段大类划分
import request from '@/utils/request'
/**
 * 登录
 * @param {String} mobile
 * @param {Number} code
 * @returns Promise
 */
export const loginAPI = (mobile, code) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
/**
 * 发送验证码
 * @param {String} mobile 手机号
 * @returns Promise
 */
export const sendCodeAPI = (mobile) => {
  return request({
    method: 'get',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
/**
 * 获取用户信息
 * @returns Promise
 */
export const getUserInfoAPI = () => {
  return request({
    method: 'get',
    url: '/v1_0/user'
    // headers: { Authorization: `Bearer ${store.state.tokenObj.token}` }
  })
}
/**
 * 上传图片
 * @param {*} file 裁剪过后的图片的file对象
 * @returns
 */
export const uploadPhotoAPI = (file) => {
  const fm = new FormData()
  fm.append('photo', file)
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data: fm
  })
}
/**
 * 编辑用户个人资料
 * @returns
 */
export const EditUserAPI = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}
/**
 * 获取用户个人资料
 * @returns
 */
export const getUserAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}
/**
 * 获取关注
 * @param {String} target
 * @returns
 */
export const followAPI = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: { target }
  })
}
export const cancelFollowAPI = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}
