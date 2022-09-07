<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar title="标题" class="nav-bar" />
    <!-- 表单 -->
    <van-form @submit="onSubmit" class="form" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="codeRules"
      >
        <!-- 字体图标 -->
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="mobileRules"
      >
        <!-- 字体图标 -->
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <!-- 验证码 -->
        <template #button>
          <van-button
            round
            type="default"
            size="small"
            native-type="button"
            class="btn"
            v-if="isShowCodeBtn"
            @click="sendCode"
            >获取验证码</van-button
          >
          <van-count-down
            v-else
            :time="60 * 1000"
            format="ss秒"
            @finish="isShowCodeBtn = true"
          />
        </template>
      </van-field>

      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { mobileRules, codeRules } from '@/views/login/rules'
import { loginAPI, sendCodeAPI } from '@/api/index'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCodeBtn: true
    }
  },
  methods: {
    // 将vuex里面的mutations 映射到methods里面 此时methods里面就有一个SET_TOKEN方法
    ...mapMutations(['SET_TOKEN']),
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
    },
    async onSubmit() {
      // Submit事件只有在表单校验通过的时候才会被触发
      // 登录提示
      this.loading()

      // 登录
      try {
        const { data } = await loginAPI(this.mobile, this.code)
        console.log(data)
        // 成功提示
        this.$toast.success('登录成功')
        // 跳转路由
        this.$router.push({
          path: '/profile'
        })
        // 储存到vuex里面
        // 方法一
        this.$store.commit('SET_TOKEN', data.data)
        // 方法二
        this.SET_TOKEN(data.data)
      } catch (err) {
        // axios 封装的error对象
        // -err.response.data后端返回的数据
        // -err.response.status后端返回的状态码
        // err: 1.js抛出的错误 2.axios封装的error对象发出的错误
        if (err.response && err.response.status === 400) {
          this.$toast.fail(err.response.data.message)
        } else {
          console.dir(err)
          // 清除toast
          this.$toast.clear()
        }
      }
    },
    async sendCode() {
      // 验证用户是否输入正确的 手机号
      // -form绑定ref
      // -$refs.form.validate('mobile')
      await this.$refs.form.validate('mobile')
      this.loading()
      // 1.发送请求
      try {
        await sendCodeAPI(this.mobile)
        // 2.显示倒计时组件
        this.isShowCodeBtn = false
        this.$toast.success('发送验证码成功')
      } catch (err) {
        if (
          err.response &&
          (err.response.status === 429 || err.response.status === 404)
        ) {
          this.$toast.fail(err.response.data.message)
        } else {
          this.$toast.clear()
          throw err
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nav-bar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
}
/deep/.form {
  .van-cell__title {
    flex: 1;
  }
  .van-cell__value {
    flex: 20;
  }
  .toutiao {
    font-size: 40px;
  }
}
.btn {
  height: 0.64rem;
  color: #807379;
}
</style>
