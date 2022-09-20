<template>
  <div>
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="confirm"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { EditUserAPI } from '@/api'

import dayjs from '@/utils/day'
export default {
  props: {
    birthday: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()
    }
  },
  methods: {
    cancel() {
      // 弹层关闭
      this.$parent.$parent.isShowBirthday = false
    },
    async confirm(value) {
      // 弹层关闭
      this.$parent.$parent.isShowBirthday = false
      // 回显
      this.$parent.$parent.userList.birthday = dayjs(value).format('YYYY-MM-DD')
      //   console.log(dayjs(value).format('YYYY-MM-DD'))
      await EditUserAPI({ birthday: dayjs(value).format('YYYY-MM-DD') })
    }
  }
}
</script>

<style></style>
