<template>
  <div class="channel-edit">
    <van-cell title="我的频道">
      <van-button
        class="btn"
        size="mini"
        round
        style="color: red; border: 1px solid red"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 频道 -->
    <div class="my-pannel">
      <van-grid :gutter="10" :border="false">
        <van-grid-item
          v-for="(item, index) in myChannels"
          :class="{ active: item.name === '推荐' }"
          :key="item.id"
          :text="item.name"
          :icon="isEdit && item.name !== '推荐' ? 'cross' : ''"
          @click="handleMyChannel(item, index)"
        >
          <!-- <template #icon>
            <van-icon name="cross" />
          </template> -->
        </van-grid-item>
      </van-grid>
    </div>

    <van-cell title="推荐频道"> </van-cell>
    <div class="recommend-pannel">
      <van-grid :gutter="10" :border="false">
        <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
          :text="item.name"
          icon="plus"
          @click="$emit('add-channel', item)"
        >
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannelApi } from '@/api'
export default {
  props: {
    myChannels: Array
  },
  data() {
    return {
      isEdit: false,
      Allchannels: []
    }
  },
  created() {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels() {
      const { data } = await getAllChannelApi()
      console.log(data)
      this.Allchannels = data.data.channels
    },
    handleMyChannel({ name, id }, index) {
      if (this.isEdit && name !== '推荐') {
        console.log('删除频道', name)
        this.$emit('del-channel', id)
      } else {
        // 1.关闭弹窗
        // 2.切换频道
        this.$emit('change-active', index)
      }
    }
  },
  computed: {
    recommendChannels() {
      return this.Allchannels.filter((AllchannelItem) => {
        const target = this.myChannels.find(
          // find 找到对应的值会返回这个值 找不到返回undifined
          (myChannelsItem) => {
            return myChannelsItem.id === AllchannelItem.id
          }
        )
        return !target
      })
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  margin-top: 92px;
}
:deep(.btn) {
  width: 100px;
  font-size: 25px;
}
:deep(.van-grid-item__content) {
  background-color: #f4f5f6;
}
// 我的频道
.my-pannel {
  // 编辑按钮居中
  .van-cell__value {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  // 关闭按钮样式
  :deep(.van-grid-item__content) {
    position: relative;

    .van-grid-item__content {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
:deep(.van-icon-cross) {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 25px;
  transform: translate(20%, -35%);
  border: 0.02667rem solid #000;
  border-radius: 50%;
  text-align: center;
  line-height: 0.32rem;
}
// 推荐频道
.recommend-pannel {
  // 推荐频道加号样式
  :deep(.van-grid-item__content) {
    flex-direction: row;

    .van-grid-item__icon {
      font-size: 0.5rem;
    }

    .van-grid-item__text {
      margin-top: 0;
    }
  }
}
:deep(.active) {
  .van-grid-item__text {
    color: red;
  }
}
</style>
