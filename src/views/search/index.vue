<template>
  <div>
    <!-- 搜索框 -->
    <van-search
      v-model.trim="keywords"
      show-action
      background="#3296fa"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @focus="isShowSearchResults = false"
      @cancel="$router.push('/')"
    />
    <!-- 搜索历史 -->
    <!-- 搜索结果 -->
    <!-- <searchHistory></searchHistory>
    <searchSuggestion></searchSuggestion>
    <searchResult></searchResult> -->
    <component
      :is="componentName"
      :keywords="keywords"
      @change-keywords="onSearch"
    ></component>
  </div>
</template>

<script>
import searchHistory from './components/searchHistory.vue'
import searchSuggestion from './components/searchSuggestion.vue'
import searchResult from './components/searchResult.vue'
import { mapMutations, mapState } from 'vuex'
export default {
  components: { searchHistory, searchSuggestion, searchResult },
  data() {
    return {
      keywords: '',
      isShowSearchResults: false
    }
  },
  methods: {
    ...mapMutations(['SET_HISTORISE']),
    onSearch(keywords) {
      // 把keyword关键词存起来
      // 1 用户敲回车键 2.点击搜索建议
      // 数组去重 new Set(数组) 结果为对象然后再通过扩展运算符转换为数组
      const distinctHistories = [...new Set([keywords, ...this.histories])]
      // this.SET_HISTORISE([keywords, ...this.histories])
      this.SET_HISTORISE(distinctHistories)
      this.keywords = keywords
      this.isShowSearchResults = true
    }
  },
  computed: {
    ...mapState(['histories']),
    componentName() {
      if (this.keywords === '') {
        return 'searchHistory'
      }
      if (this.isShowSearchResults) {
        return 'searchResult'
      }
      return 'searchSuggestion'
    }
  }
}
</script>

<style lang="less" scoped>
div[role='button'] {
  color: #fff;
}
</style>
