<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        offset="100"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="getNextComment"
        :immediate-check="false"
      >
        <van-cell v-for="(item, index) in results" :key="index">
          <div class="comment">
            <van-image
              class="img"
              round
              width="36"
              height="36"
              :src="articleList.aut_photo"
            />
            <div class="content">
              <div class="author">{{ articleList.aut_name }}</div>
              <p class="text">{{ item.content }}</p>
              <div class="desc">
                <span class="time">{{ item.pubdate | time }}</span>
                <van-button
                  round
                  type="default"
                  class="reply"
                  @click="getcom(item)"
                  >回复{{ item.reply_count }}</van-button
                >
              </div>
            </div>
            <div class="like" @click="getLike(item, index)">
              <van-icon name="good-job" :class="{ liking: item.is_liking }" />赞
            </div>
          </div>
        </van-cell>
        <!-- 回复评论 -->
        <van-popup
          v-model="isshowComments"
          position="bottom"
          :style="{ height: '100%' }"
        >
          <reComment
            :results="results"
            @close="isshowComments = false"
            :currentItem="currentItem"
          ></reComment>
        </van-popup>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getCommentApi, getLikeApi, cancelLikeApi } from '@/api'
import dayjs from '@/utils/day'
import reComment from './reComment'

export default {
  components: { reComment },

  props: {
    articleList: { type: Object, required: true }
  },
  data() {
    return {
      loading: '',
      finished: false,
      error: false,
      refreshing: false,
      type: 'a',
      source: this.articleList,
      limit: 10,
      offset: null,
      endId: null,
      results: [],
      isshowComments: false,
      currentItem: {},
      idList: [],
      isliking: false
    }
  },
  created() {
    this.getComment()
  },
  methods: {
    // 获取首页评论
    async getComment() {
      try {
        const { data } = await getCommentApi(
          this.type,
          this.articleList.art_id,
          this.limit
        )
        this.results.push(...data.data.results)
        // 保存下一页的id
        this.offset = data.data.last_id
        // 保存评论id
        this.$emit('info', data.data.total_count)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast.fail('请求参数错误')
        }
      } finally {
        this.loading = false
      }
    },
    // 获取下一页数据
    async getNextComment() {
      try {
        const { data } = await getCommentApi(
          this.type,
          this.articleList.art_id,
          this.limit,
          this.offset
        )
        if (data.data.results.length) {
          // 保存下一页的id
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
        // 添加到原有数组后面
        this.results = [...this.results, ...data.data.results]
        console.log(this.results)
      } catch (error) {
        // 如果发生数据加载失败 底部显示报错
        this.error = true
      } finally {
        // 数据更新完毕后更改loading为fasle 不管报错还是正常加载
        this.finished = true
        // 请求完之后 关闭
        this.loading = false
        this.refreshloading = false
      }
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.getComment()
    },
    // 获取点击回复当前的文章
    getcom(item) {
      this.isshowComments = true
      this.currentItem = item
    },
    // 点赞/取消点赞
    async getLike(item, index) {
      //   const index = this.idList.indexOf(id)
      //   if (index === -1) {
      //     this.idList.push(id)
      //     try {
      //       const data = await getLikeApi(id)
      //       console.log(data)
      //     } catch (error) {
      //       if (error.response && error.response.status === 401) {
      //         this.$toast.fail('请重新登录')
      //       }
      //     }
      //   } else {
      //     this.idList.splice(index, 1)
      //     const data = await cancelLikeApi(id)
      //     console.log(data)
      //   }
      try {
        this.$toast.loading({
          forbidClick: true,
          duration: 0 // 持续展示 toast
        })
        // 如果刚开始is_liking为false 也就是未点赞状态
        if (!item.is_liking) {
          await getLikeApi(item.com_id)
          this.results[index].is_liking = true
          this.$toast.success('点赞成功')
        } else {
          await cancelLikeApi(item.com_id)
          this.results[index].is_liking = false
          this.$toast.success('取消点赞')
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请重新登录')
        }
      }
    }
  },
  // dayjs过滤时间
  filters: {
    time(value) {
      return dayjs(value).fromNow()
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
/deep/.comment {
  display: flex;
  margin-bottom: 20px;
  //   justify-content: space-between;
  .content {
    // flex: 1;
    width: 514px;
    margin-left: 20px;
    p {
      margin: 0 0 32px 0;
    }
    .desc {
      display: flex;
      align-items: center;
      height: 56px;
      line-height: 56px;
      .time {
        margin-right: 20px;
      }
      .reply {
        width: 165px;
        height: 44px;
      }
    }
  }
  /deep/.like {
    flex: 1;
    width: 84px;
  }
  .liking {
    color: red;
  }
}
</style>
