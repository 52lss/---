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
/**
 * 获取文章详情
 * @param {String} articleId 文章id
 * @returns
 */
export const getNewsAPI = (articleId) => {
  return request({
    url: `/v1_0/articles/${articleId}`
  })
}
/**
 * 收藏文章
 * @param {String} target 文章id
 * @returns
 */
export const getCollectAPI = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: { target }
  })
}
/**
 * 取消收藏
 * @param {String} target 文章id
 * @returns
 */
export const cancelCollectAPI = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}
/**
 * 点赞
 * @param {String} target 文章id
 * @returns
 */
export const getLikingAPI = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: { target }
  })
}
/**
 * 取消点赞
 * @param {String} target 文章id
 * @returns
 */
export const cancelLikingAPI = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
