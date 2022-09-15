<template>
  <div>
    <!-- 搜索历史的标题 -->
    <van-cell title="搜索历史">
      <template>
        <van-icon
          name="delete-o"
          v-if="!isEdit"
          @click="isEdit = true"
        ></van-icon>
        <div v-else>
          <span @click="$store.commit('SET_HISTORISE', [])">全部删除</span>
          <span @click="isEdit = false"> 完成</span>
        </div>
      </template>
    </van-cell>
    <!-- 搜索历史 -->
    <van-cell
      @click="!isEdit && $emit('change-keywords', item)"
      v-for="(item, index) in histories"
      :key="index"
      :title="item"
    >
      <template #extra>
        <van-icon
          name="close"
          v-show="isEdit"
          @click="
            $store.commit(
              'SET_HISTORISE',
              histories.filter((i) => item != i)
            )
          "
        ></van-icon>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isEdit: false
    }
  },
  computed: {
    ...mapState(['histories'])
  }
}
</script>

<style></style>
