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

/**
 * 获取所有的频道
 * @returns Promise
 */
export const getAllChannelApi = () => {
  return request({
    url: '/v1_0/channels'
  })
}
/**
 * 删除频道
 * @param {String|Number} id
 * @returns Promise
 */
export const delChannelApi = (id) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${id}`
  })
}
/**
 *
 * @param {String|Number} id 新增频道的id
 * @param {Number} seq 新增频道添加的索引值
 * @returns Promise
 */
export const addChannelApi = (id, seq) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [{ id, seq }]
    }
  })
}
