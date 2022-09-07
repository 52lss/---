<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="SET_COUNT(10)">点击乘以10</button>
  </div>
</template>

<script>
// mapState 将vuex里面的state里面映射到computed
// 使用
// -引入mapstate：函数，返回一个对象
// -参数：['映射的属性']

// mapGetters 将vuex里面getters映射到computed

// mapMutations 将vuex里面 mutations方法映射到methods
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['count'])
  },
  computed: {
    // 代替 count:function(){
    //  return this.$store.satate.count
    // }
    ...mapState(['count']),
    //
    ...mapGetters(['count'])
  }
}
</script>

<style></style>
