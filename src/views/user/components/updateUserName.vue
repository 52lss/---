<template>
  <div>
    <!-- 标题 -->
    <van-nav-bar
      title="更新昵称"
      left-text="取消"
      right-text="保存"
      left-arrow
      @click-left="cancel"
      @click-right="confirm"
    />
    <!-- 输入框 -->
    <van-field
      v-model="value"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      show-word-limit
    />
  </div>
</template>

<script>
import { EditUserAPI } from '@/api'

export default {
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: this.username,
      isConfirm: false
    }
  },
  methods: {
    cancel() {
      if (!this.isConfirm) {
        // 弹层关闭
        this.$parent.$parent.isShowName = false
      }
    },
    async confirm() {
      this.isConfirm = true
      // 弹层关闭
      this.$parent.$parent.isShowName = false
      if (this.isConfirm) {
        this.$parent.$parent.userList.name = this.value
      }
      await EditUserAPI({ name: this.value })
    }
  }
}
</script>

<style></style>
