<template>
  <div class="update-avatar">
    <img :src="photo" ref="image" />

    <div class="toolbar">
      <span>取消</span>
      <span @click="confirm">完成</span>
    </div>
  </div>
</template>

<script>
// yarn add cropperjs

//
// 更新用户的头像
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { uploadPhotoAPI } from '@/api'
export default {
  props: {
    photo: { type: String, required: true }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.myCropper = new Cropper(this.$refs.image, {
        viewMode: 1,
        dragMode: 'none',
        initialAspectRatio: 1,
        aspectRatio: 1,
        preview: '.before',
        background: false,
        autoCropArea: 0.6,
        zoomOnWheel: false
      })
    },
    confirm() {
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        const { data } = await uploadPhotoAPI(blob)
        console.log(data)
        // 更新src
        // .sync修饰符会给修饰的对象自动绑定一个updata事件  'updata:avator' 通过$emit去触发'update:avator' 事件 并传值给.sync修饰的对象 会自动更新值得变化
        this.$emit('update:avator', data.data.photo)

        // 弹层关闭
        this.$parent.$parent.isShowPhoto = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.update-avatar {
  background: #000;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 65%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 9999;
  }
  .toolbar {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
  }
}
</style>
