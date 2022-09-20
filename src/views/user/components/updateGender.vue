<template>
  <div>
    <van-picker
      title="更新性别"
      show-toolbar
      :columns="columns"
      :default-index="2"
      @confirm="confirm"
      @cancel="cancel"
      ref="picker"
    />
  </div>
</template>

<script>
import { EditUserAPI } from '@/api'

export default {
  // props: {
  //   username: {
  //     type: String,
  //     required: true
  //   }
  // },
  data() {
    return {
      columns: [
        { text: '男', value: 0 },
        { text: '女', value: 1 }
      ]
    }
  },
  methods: {
    cancel() {
      // 弹层关闭
      this.$parent.$parent.isShowGender = false
    },
    async confirm() {
      console.log(this.$refs.picker.getValues()[0])
      // 弹层关闭
      this.$parent.$parent.isShowGender = false
      // 回显
      this.$parent.$parent.userList.gender = this.$refs.picker.getValues()[0].text
      // 发送编辑得数据给后端
      await EditUserAPI({ gender: this.$refs.picker.getValues()[0].value })
    }
  }
}
</script>

<style></style>
