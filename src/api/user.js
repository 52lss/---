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
