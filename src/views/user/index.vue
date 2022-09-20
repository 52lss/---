<template>
  <div>
    <!-- 个人信息导航条 -->
    <van-nav-bar
      class="navbar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 更新头像 -->
    <!-- @change输入框发送改变时触发 不过两次提交同一张图片第二次不会触发 -->
    <input
      type="file"
      ref="file"
      hidden
      multiple
      accept=".png,pdf,jpg"
      @change="selectPhoto"
    />
    <!-- 信息修改 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image
        round
        width="0.8rem"
        height="0.8rem"
        :src.sync="userList.photo"
      ></van-image>
    </van-cell>
    <!-- 更新头像的弹出层 -->
    <van-popup
      v-model="isShowPhoto"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- v-if="isShowPhoto" 解决第一次接收图片后 第二次打开接收图片 不会显示第二接收的图片的bug 原因是弹出层this.init() 挂载后mounted 只执行了一次 通过v-if 可以让页面关闭销毁 下次打开后重新触发mounted里面的this.init() -->
      <updateAvator
        v-if="isShowPhoto"
        :photo="photo"
        :avator.sync="avator"
      ></updateAvator>
    </van-popup>
    <!-- 昵称 -->
    <van-cell title="昵称" is-link @click="isShowName = true">
      {{ userList.name }}
    </van-cell>
    <!-- 昵称弹出层 -->
    <van-popup
      v-model="isShowName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <updateUserName
        v-if="isShowName"
        :username="userList.name"
      ></updateUserName>
      <!-- <updateAvator
        v-if="isShowPhoto"
        :photo="photo"
        :avator.sync="avator"
      ></updateAvator> -->
    </van-popup>
    <!-- 性别 -->
    <van-cell title="性别" is-link @click="isShowGender = true">
      {{ userList.gender }}
    </van-cell>
    <!-- 性别弹出层 -->
    <van-popup
      v-model="isShowGender"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <updateGender v-if="isShowGender"></updateGender>
    </van-popup>
    <!-- 生日 -->
    <van-cell title="生日" is-link @click="isShowBirthday = true">
      {{ userList.birthday }}
    </van-cell>
    <van-popup
      v-model="isShowBirthday"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <!-- 生日弹出层 -->
      <updateBirthday
        v-if="isShowBirthday"
        :birthday="userList.gender"
      ></updateBirthday>
    </van-popup>
  </div>
</template>

<script>
// 1.点击修改头像
// -手动触发input:file的事件

// 2. 获取用户选择的图片
// 图片被保存再input的value属性上，保存的文件的绝对路径，files数组里，保存的fiel对象
// 3.如何将file对象转换成base64
// -FileReader: 文件阅读器
// const fr = new FileReader(); fr.readAsDataURL(file);
// 接收读取的结果 fr.onload = (e) => {e.target.result/*base64*/ }
// file对象，文件的二进制对象
import updateAvator from './components/updateAvator.vue'
import updateUserName from './components/updateUserName'
import updateGender from './components/updateGender'
import updateBirthday from './components/updateBirthday'
import { resloveToBase64 } from '@/utils'
import { getUserAPI } from '@/api'
export default {
  components: { updateAvator, updateUserName, updateGender, updateBirthday },
  data() {
    return {
      isShowPhoto: false,
      isShowName: false,
      isShowGender: false,
      isShowBirthday: false,
      photo: '',
      avator: '',

      userList: [],
      name: '',
      gender: '',
      birthday: '',
      real_name: '',
      intro: ''
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    async selectPhoto() {
      // 获取用户选择的图片的file对象
      const file = this.$refs.file.files[0]
      // console.log(file)
      // file 对象转成img.src可以识别的属性
      // file转换成base
      const base64 = await resloveToBase64(file)
      this.photo = base64
      // 打开弹窗
      this.isShowPhoto = true

      // 解决不能连续选中同一张图片的bug
      this.$refs.file.value = ''
    },
    // 编辑用户资料
    // async EditUser() {
    //   try {
    //     await EditUserAPI({
    //       name: this.userList.name,
    //       gender: this.userList.gender,
    //       birthday: this.userList.gender
    //     })
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    // 获取用户资料
    async getUser() {
      const { data } = await getUserAPI()
      console.log(data)
      this.userList = data.data
      if (data.data.gender === 0) {
        this.userList.gender = '男'
      } else {
        this.userList.gender = '女'
      }
    }
  }
  // watch: {
  //   userList: {
  //     immediate: true,
  //     handler: 'EditUser'
  //   }
  // }
}
</script>

<style lang="less" scoped>
.navbar {
  background: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff !important;
  }
  :deep(.van-icon) {
    color: #fff !important;
  }
}
</style>
