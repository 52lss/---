<template>
  <div class="message">
    <van-field
      class="comment"
      v-model.trim="content"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <div class="publish" @click="publish">发布</div>
  </div>
</template>

<script>
import { commentApi } from '@/api'
export default {
  props: {
    articleId: { type: String, required: true }
  },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    // 发布评论
    async publish() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '发布中'
      })
      try {
        const { data } = await commentApi(this.articleId, this.content)
        console.log(data)
        this.content = ''
        this.$emit('post', data.data.new_obj)
        this.$toast.success('发布成功')
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast.fail('请重新输入')
        } else if (error.response.status === 401) {
          this.$toast.fail('请重新登录')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0 32px 32px;
  .comment {
    width: 600px;
    padding: 16px;
    background-color: #f5f7f9;
  }
  .publish {
    flex: 1;
    text-align: center;
    font-size: 28px;
    color: #6ba3d8;
  }
}
</style>
