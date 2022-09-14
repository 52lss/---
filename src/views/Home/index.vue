<template>
  <div>
    <!-- 搜索框 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button icon="search" size="small" round block>搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- 频道及文章 -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>
      <span class="toutiao toutiao-gengduo" @click="isShow = true"></span>
    </van-tabs>
    <!-- 弹出层 -->
    <van-popup
      v-model="isShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <ChannelEdit
      v-if="isShow"
        @change-active=";[(isShow = false), (active = $event)]"
        :myChannels="channels"
        @del-channel="delChannel"
        @add-channel="addChannel"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getchannelApi, delChannelApi, addChannelApi } from '@/api'
import ArticleList from './components/article.vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: { ArticleList, ChannelEdit },

  data() {
    return {
      active: 0,
      channels: [],
      isShow: false
    }
  },
  created() {
    this.initChannels()
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  // 1. ?? ==>相当于||，常用于if语句
  // 2. ？ ==> 可选链操作符，？前面是undifined,那么不会往后取消

  //
  methods: {
    ...mapMutations(['SET_MY_CHANNEL']),
    initChannels() {
      // 如果登录了 getChannel就发送请求获取频道
      if (this.isLogin) {
        this.getChannel()
      } else {
        // 如果没有登录 分两种
        // 1.本地有数据
        // -直接用本地的数据渲染
        // 2.本地没有数据
        // -发送请求，获取默认的频道
        const myChannels = this.$store.state.myChannels
        if (myChannels.length === 0) {
          this.getChannel()
        } else {
          this.channels = myChannels
        }
      }
    },
    async getChannel() {
      try {
        const { data } = await getchannelApi()
        // console.log(data)
        this.channels = data.data.channels
      } catch (err) {
        if (!err.response) {
          throw err
        } else {
          const status = err.response.status
          status === 507 && this.$toast.fail('服务端异常，请刷新')
        }
      }
    },
    async delChannel(id) {
      try {
        const newChannels = (this.channels = this.channels.filter(
          (item) => item.id !== id
        ))
        if (this.isLogin) {
          // 1.发送请求删除数组
          await delChannelApi(id)
        } else {
          // 把我的频道存到本地
          this.SET_MY_CHANNEL(newChannels)
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再删除')
        } else {
          throw error
        }
      }
    },
    async addChannel(channel) {
      try {
        if (this.isLogin) {
          await addChannelApi(channel.id, this.channels.length)
        } else {
          // 把我的频道存到本地
          this.SET_MY_CHANNEL([...this.channels, channel])
        }
        this.channels.push(channel)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再删除')
        } else {
          throw error
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;

  // inherit 继承
  // unset 不设置
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button--default {
    background-color: #5babfb;
    border: 0;
    color: #fff;
    font-size: 30px;
  }

  .van-icon {
    color: #fff;
  }
  .van-button--block {
    width: 7.4rem;
  }
}
/* tabs导航条样式 */
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
</style>
