// 所有关于新闻的接口
import request from '@/utils/request'
/**
 * 获取文章
 * @param {String} Number} id 频道的id
 * @param {Number} timestamp 请求的新的推荐数据传当前的时间戳，请求下一页的数据，传当前时间戳的返回的结果
 * @returns
 */
export const getArticleAPI = (id, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: id,
      timestamp
    }
  })
}
