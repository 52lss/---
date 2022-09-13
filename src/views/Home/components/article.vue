<template>
  <div class="article">
    <!-- @Load：触底的时候触发load事件 -->
    <!-- offset 滚动条距离底部多少的距离触发load事件，默认是300px -->
    <!-- immediate-check 页面初渲染的时候是否立即执行load事件 默认时true -->
    <van-pull-refresh v-model="refreshloading" @refresh="getNextPageArticle">
      <van-list
        v-model="loading"
        @load="getNextPageArticle"
        offset="100"
        :finished="finished"
        :error.sync="error"
        finished-text="没有更多了"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :article="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleAPI } from '@/api'
import ArticleItem from './ArticleItem'
export default {
  props: {
    id: [String, Number]
  },
  components: { ArticleItem },
  data() {
    return {
      articles: [],
      preTimestamp: '',
      loading: false,
      finished: false,
      error: false,
      refreshloading: false
    }
  },
  created() {
    this.getFirstPageArticle()
  },
  methods: {
    async getFirstPageArticle() {
      try {
        const { data } = await getArticleAPI(this.id, +new Date())

        this.articles = data.data.results
        // 保存下一页时间戳，用于分页
        this.preTimestamp = data.data.pre_timestamp
      } catch (error) {
        const status = error.response?.status
        if (!error.response || status === 507) {
          throw error
        } else {
          if (status === 400) {
            throw new Error(error.response.data.message)
          }
        }
      }
    },
    // 获取下页的数据
    async getNextPageArticle() {
      try {
        // if (Math.random() < 0.5) {
        //   throw new Error()
        // }
        // 1.发送请求
        const { data } = await getArticleAPI(this.id, this.preTimestamp)
        // console.log(data)
        // 5.数据全部加载完成 (即data.data.pre_timestamp 值为空)
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        // 2.添加到数组中
        if (this.refreshloading) {
          // 下拉刷新的时候refreshloading 变成true
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        // 3.更新时间戳 下一页的索要传的数据为上一页数据返回的的preTimestamp
        this.preTimestamp = data.data.pre_timestamp
        // 4. 当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true 数据更新完毕后更改loading为fasle
        // this.loading = false
      } catch (error) {
        // 6. 当出现错误的时候 在列表底部显示报错
        this.error = true
      } finally {
        // 数据更新完毕后更改loading为fasle 不管报错还是正常加载
        this.loading = false
        this.refreshloading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  height: calc(100vh - 92px - 83px - 100px);
  overflow: auto;
  // &: 代表当前元素他爹
  // ::-webkit-scrollbar : 滚动槽
  // ::-webkit-scrollbar-thumb: 滚动的滑块
  &::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3296fa;
    border-radius: 10px;
  }
}
</style>
