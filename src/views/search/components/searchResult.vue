<template>
  <div class="result">
    <van-list
      v-model="loading"
      @load="getRseults"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="item in results"
        :key="item.art_id"
        :title="item.title"
        @click="$router.push({
          path:'/detail',
          query: {articleId: item.art_id}
        })"
      ></van-cell>
    </van-list>
  </div>
</template>

<script>
import { getRseultAPI } from '@/api'
export default {
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      page: 1,
      perPage: 10,
      results: [],
      finished: false,
      error: false
    }
  },
  methods: {
    async getRseults() {
      try {
        // if (Math.random() < 0.8) {
        //   throw new Error()
        // }
        const { data } = await getRseultAPI(
          this.page++,
          this.perPage,
          this.keywords
        )
        const results = data.data.results
        // 当没有数据的时候把finished改为true 显示没有更多
        if (results.length === 0) {
          this.finished = true
        }
        // 保存数据
        // this.results.push(...data.data.results)
        this.results = [...this.results, ...results]
      } catch {
        this.error = true
      } finally {
        // 关闭loading
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.result {
  // overlay和auto用法基本一致
  height: calc(100vh - 108px);
  overflow: overlay;
}
</style>
