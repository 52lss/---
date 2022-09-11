import request from '@/utils/request'
/**
 * 获取用户自己的频道
 * @returns Promise
 */
export const getchannelApi = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}
