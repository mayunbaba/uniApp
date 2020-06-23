<template>
<view>

  <view class="page-no-login" v-if="show">
    <image :src="imgSrc" class="group" mode="aspectFit"></image>
    <text>{{text}}</text>
    <view type="button" @click="goLogin" class="login">{{button}}</view>
  </view>

</view>
</template>

<script>
import utils from '@/utils/util';
import { request } from '@/utils/request';

export default {
	name: "noLogin",
  data() {
    return {
      record_id: '',
      session_key: '',
      open_id: ''
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    imgSrc: {
      type: String,
      default: '/static/images/group.png'
    },
    text: {
      type: String,
      default: '登录后即可收藏喜欢的菜品'
    },
    button: {
      type: String,
      default: '手机号登录'
    },
    buttonUrl: {
      type: String,
      default: '/pages/login'
    },
    islogin: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goLogin() {
      if (this.buttonUrl.indexOf('home') > -1) {
				uni.switchTab({
					url: this.buttonUrl
				})
      } else {
        utils.xhNavigateTo(this.buttonUrl);
      }
    },

  },
};
</script>
<style lang="less">

.page-no-login {
  width: 100vw;
  height: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
}

.page-no-login .group {
	width: 100%;
  height: 146rpx;
  margin-top: 340rpx;
  margin-bottom: 49rpx;
}

.page-no-login .login {
  margin-top: 72rpx;
  width: 360rpx;
  height: 86rpx;
  line-height: 86rpx;
  background-color: #ff233b;
  font-size: 32rpx;
  color: #ffffff;
  border-radius: 8rpx;
  font-weight: bold;
  text-align: center;
}

.page-no-login .bd-login {
  margin-top: 72rpx;
  width: 360rpx;
  height: 86rpx;
  line-height: 86rpx;
  background-color: #3b77fb;
  font-size: 32rpx;
  color: #ffffff;
  border-radius: 8rpx;
  font-weight: bold;
  text-align: center;
}

.page-no-login text {
  font-size: 30rpx;
  height: 42rpx;
  color: #666666;
}

</style>