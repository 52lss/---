import request from '@/utils/request'
/**
 * 获取评论
 * @param {String} type 评论或者回复
 * @param {String} source 文章id
 * @param {Number} limit 获取评论数量
 * @returns
 */
export const getCommentApi = (type, source, limit) => {
  return request({
    url: '/v1_0/comments',
    params: { type: type, source: source, limit: limit }
  })
}
/**
 * 对文章进行评论
 * @param {String} target 评论的目标id
 * @param {String} content 评论内容
 * @returns
 */
export const commentApi = (target, content, artId) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: { target: target, content: content, artId: artId }
  })
}
/**
 * 点赞
 * @param {String} target 文章id
 * @returns
 */
export const getLikeApi = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: { target: target }
  })
}
/**
 * 取消点赞
 * @param {String} target 文章id
 * @returns
 */
export const cancelLikeApi = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}
