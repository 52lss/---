<template>
  <div class="pinglun">
    <div class="reply">
      <van-nav-bar
        :title="
          currentItem.reply_count
            ? `${currentItem.reply_count}条回复`
            : '暂无回复'
        "
        left-arrow
        @click-left="$emit('close')"
      />
    </div>
    <van-cell>
      <div class="comment">
        <van-image
          class="img"
          round
          width="36"
          height="36"
          :src="currentItem.aut_photo"
        />
        <div class="content">
          <div class="author">{{ currentItem.aut_name }}</div>
          <p class="text">{{ currentItem.content }}</p>
          <div class="desc">
            <span class="time">{{ currentItem.pubdate | time }}</span>
            <van-button round type="default" class="replybtn">回复</van-button>
          </div>
        </div>
        <div class="like" @click="getLike(currentItem.com_id)">
          <van-icon
            :class="{ liking: idList.indexOf(currentItem.com_id) !== -1 }"
            name="good-job-o"
          />赞
        </div>
      </div>
    </van-cell>
    <van-cell>全部回复</van-cell>
    <div class="reply-content">
      <van-list
        v-model="loading"
        offset="100"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="getNextComment"
        :immediate-check="false"
      >
        <van-cell v-for="(item, index) in result" :key="index">
          <div class="comment">
            <van-image
              class="img"
              round
              width="36"
              height="36"
              :src="item.aut_photo"
            />
            <div class="content">
              <div class="author">{{ item.aut_name }}</div>
              <p class="text">{{ item.content }}</p>
              <div class="desc">
                <span class="time">{{ item.pubdate | time }}</span>
                <van-button round type="default" class="replybtn"
                  >回复</van-button
                >
              </div>
            </div>
            <div class="like" @click="getLike(item.com_id)">
              <van-icon
                :class="{ liking: idList.indexOf(item.com_id) !== -1 }"
                name="good-job-o"
              />赞
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
    <div class="commited">
      <van-button round class="commited-btn" @click="isshowComments = true"
        >评论</van-button
      >
      <van-popup
        v-model="isshowComments"
        position="bottom"
        :style="{ height: '20%' }"
        class="popup"
      >
        <van-field
          class="commentText"
          v-model.trim="content"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <div class="publish" @click="publish">发布</div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import dayjs from '@/utils/day'
import { getCommentApi, commentApi, getLikeApi, cancelLikeApi } from '@/api'
export default {
  name: 'reComment',
  props: {
    currentItem: { type: [Object, Array], default: null },
    // comId: { type: String, default: null },
    results: { type: Array, require: true }
  },
  data() {
    return {
      loading: '',
      finished: false,
      error: false,
      refreshing: false,
      type: 'c',
      source: this.articleList,
      limit: 10,
      offset: null,
      endId: null,
      content: '',
      isshowComments: false,
      result: [],
      idList: []
    }
  },
  created() {
    this.getcomment()
  },
  methods: {
    // 获取回复
    async getcomment() {
      try {
        const { data } = await getCommentApi(
          this.type,
          this.currentItem.com_id,
          this.limit
        )
        console.log(data)
        this.result = data.data.results
        // 保存下一页的id
        this.offset = data.data.last_id
      } catch (error) {
        this.$toast.fail(error)
      } finally {
        this.loading = false
      }
    },
    async getNextComment() {
      try {
        // if (Math.random() < 0.8) {
        //   throw new Error()
        // }
        const { data } = await getCommentApi(
          this.type,
          this.articleList.art_id,
          this.limit,
          this.offset
        )
        if (data.data.results.length) {
          // 保存下一页的id
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
        // 添加到原有数组后面
        this.result = [this.result, ...data.data.results]
      } catch (error) {
        // 如果发生数据加载失败 底部显示报错
        this.error = true
      } finally {
        // 数据更新完毕后更改loading为fasle 不管报错还是正常加载
        this.finished = true
        // 请求完之后 关闭
        this.loading = false
        this.refreshloading = false
      }
    },
    async publish() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '发布中'
      })
      const { data } = await commentApi(this.type, this.content)
      console.log(data)

      // 添加到原有数组后面
      this.result.unshift(data.data.new_obj)
      // this.result = [...data.data.results, this.result]
      this.content = ''
      this.isshowComments = false
      this.$toast.success('发布成功')
    },
    // 点赞/取消点赞
    async getLike(id) {
      const index = this.idList.indexOf(id)
      if (index === -1) {
        this.idList.push(id)
        try {
          await getLikeApi(id)
        } catch (error) {
          if (error.response && error.response.status === 401) {
            this.$toast.fail('请重新登录')
          }
        }
      } else {
        this.idList.splice(index, 1)
        const data = await cancelLikeApi(id)
        console.log(data)
      }
    }
  },
  filters: {
    time(value) {
      return dayjs(value).fromNow()
    }
  }
}
</script>

<style lang="less" scoped>
.pinglun {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  width: 100%;
  overflow-y: scroll;
  .reply {
    /deep/.van-nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 750px;
      height: 92px;
    }

    .current {
      // width: 750px;
      height: 226px;
      //   background-color: red;
    }
  }
  .replybtn {
    width: 165px;
    height: 44px;
  }
  .reply-content {
    height: calc(100vh - 92px - 88px);
    overflow: auto;
    /deep/.comment {
      display: flex;
      margin-bottom: 20px;
      //   justify-content: space-between;
      .content {
        // flex: 1;
        // width: 514px;
        // margin-left: 20px;
        p {
          margin: 0 0 32px 0;
        }
        .desc {
          display: flex;
          align-items: center;
          height: 56px;
          line-height: 56px;
          .time {
            margin-right: 20px;
          }
          .replybtn {
            width: 165px;
            height: 44px;
          }
        }
      }
      .like {
        flex: 1;
        width: 84px;
      }
    }
  }

  .commited {
    display: flex;
    position: fixed;
    bottom: 0px;
    left: 0px;
    background-color: skyblue;
    height: 100px;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    // text-align: center;
    .commited-btn {
      width: 600px;
      height: 80px;
    }

    .popup {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;

      padding: 16px 0 16px 16px;
      .commentText {
        width: 620px;
        height: 176px;
        padding: 16px;
        background-color: #f5f7f9;
      }
    }
    .publish {
      flex: 1;
      font-size: 28px;
      color: #6ba3d8;
    }
    .liking {
      color: red;
    }
  }
}
</style>
