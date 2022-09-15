<template>
  <div>
    <transition name="van-slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  }
}
</script>

<style>
.box {
  background-color: red;
  width: 2rem;
  height: 2rem;
}
</style>
