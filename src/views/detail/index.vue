<template>
  <!-- 标题 -->
  <div class="article">
    <van-nav-bar title="黑马头条" left-arrow @click-left="$router.back()" />
    <div class="title">
      <h1>{{ articleList.title }}</h1>
    </div>
    <div class="article-head">
      <div class="user">
        <div class="pic">
          <!-- <img :src="articleList.aut_photo" alt="" /> -->
          <van-image
            width="35"
            height="35"
            round
            :src="articleList.aut_photo"
          />
        </div>
        <div class="text">
          <div class="username">{{ articleList.aut_name }}</div>
          <div class="time">{{ articleList.pubdate }}</div>
        </div>
      </div>
      <div class="focus">
        <van-button
          v-if="isClick"
          icon="plus"
          round
          type="info"
          class="follow-button"
          @click="onFocus"
          >关注</van-button
        >
        <van-button
          v-else
          icon="plus"
          round
          type="default"
          class="follow-button"
          @click="onCancel"
          >取消关注</van-button
        >
      </div>
    </div>
    <div class="markdown-body content" v-html="articleList.content"></div>
    <!-- 评论部分 -->
    <van-divider>正文结束</van-divider>
    <comment
      v-if="articleList.art_id"
      :articleList="articleList"
      @info="info = $event"
      ref="comment"
    ></comment>
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isshowComments = true"
        >写评论
      </van-button>
      <van-popup
        v-model="isshowComments"
        position="bottom"
        :style="{ height: '20%' }"
      >
        <message
          :articleId="articleList.art_id"
          @post="onSuccessPost"
        ></message>
      </van-popup>
      <van-icon
        name="comment-o"
        :badge="badge ? badge : articleList.comm_count"
        color="#777"
      />
      <van-icon
        :class="{ collect: articleList.is_collected }"
        :name="articleList.is_collected ? 'star' : 'star-o'"
        @click="collect(articleList)"
      />
      <van-icon
        :class="{ liking: articleList.attitude === 1 ? 'true' : 'false' }"
        :name="articleList.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="liking(articleList)"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
  </div>
</template>

<script>
import {
  getNewsAPI,
  followAPI,
  cancelFollowAPI,
  getCollectAPI,
  cancelCollectAPI,
  getLikingAPI,
  cancelLikingAPI
} from '@/api'
import comment from './components/comment.vue'
import message from './components/message.vue'
import '@/assets/css/github-markdown.css'
// import './github-markdown.css'
export default {
  components: { comment, message },
  props: {
    articleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      articleList: {},
      isClick: true,
      info: '',
      isshowComments: false,
      badge: '',
      // isCollect: false,
      // isLiking: false,
      status: -1
    }
  },
  created() {
    this.getNews()
  },
  methods: {
    // 文章详情
    async getNews() {
      try {
        const id = this.articleId
        const { data } = await getNewsAPI(id)
        // console.log(data)
        this.articleList = data.data
        console.log(data.data)
      } catch (error) {
        // 加载失败 404
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('获取失败')
      }
    },
    // 关注
    async onFocus() {
      this.isClick = false
      await followAPI(this.articleId)
    },
    async onCancel() {
      this.isClick = true
      await cancelFollowAPI(this.articleId)
    },
    getInfo(val) {
      this.info = val
    },
    // 底部评论
    onSuccessPost(val) {
      // 关闭弹出层
      this.isshowComments = false
      // 把新的评论渲染到列表上
      // console.log(this.$refs.comment.results)
      this.$refs.comment.results.unshift(val)
      // 获取comment组件里面的results数组长度作为info个数
      this.badge = this.$refs.comment.results.length
    },
    // 底部收藏
    async collect(articleList) {
      // this.isCollect = !this.isCollect
      this.$toast.loading({
        forbidClick: true,
        duration: 0 // 持续展示 toast
      })
      // 判断请求回来的数据里面的is_collected 如果是true表示喜欢 反之不喜欢
      if (!this.articleList.is_collected) {
        await getCollectAPI(articleList.art_id)
        this.articleList.is_collected = true
        this.$toast.success('收藏成功')
      } else {
        await cancelCollectAPI(articleList.art_id)
        this.articleList.is_collected = false
        this.$toast.success('取消收藏')
      }
    },
    // 底部点赞
    async liking(articleList) {
      // this.isLiking = !this.isLiking
      this.$toast.loading({
        forbidClick: true,
        duration: 0 // 持续展示 toast
      })
      if (articleList.attitude !== 1) {
        await getLikingAPI(articleList.art_id)
        this.articleList.attitude = 1
        this.$toast.success('点赞成功')
      } else {
        await cancelLikingAPI(articleList.art_id)
        this.articleList.attitude = -1
        this.$toast.success('取消点赞')
      }
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
  font-size: 30px;
}
@media (max-width: 375px) {
  .markdown-body {
    padding: 15px;
  }
}
.article {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow-y: scroll;
}
/deep/.van-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 750px;
  height: 92px;
}
.title {
  padding: 0.66667rem 0.42667rem;
  font-size: 0.53333rem;
  border-bottom: 1px solid #ccc;
  h1 {
    font-size: 40px;
  }
}
.article-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  .user {
    display: flex;
    padding: 0 32px;
    .pic {
      width: 70px;
      height: 70px;
      vertical-align: middle;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text {
      padding-left: 14px;
      .username,
      .time {
        font-size: 24px;
      }
      .time {
        margin-top: 8px;
        color: #b7b7b7;
      }
    }
  }

  .focus {
    .follow-button {
      height: 60px;
    }
  }
}
/deep/.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  width: 750px;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 282px;
    height: 46px;
    border: 2px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
  }
  .collect,
  .liking {
    color: orange;
  }
}
</style>
