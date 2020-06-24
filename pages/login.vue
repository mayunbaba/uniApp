<template>

	<view class="login_page">
		<view class="title">手机号码登录</view>
		<view class="input_wrap">
			<input placeholder="手机号码" id="tel" :value="tel" @input="telphone" type="number" placeholder-class="gray" maxlength="11"></input>
			<image class="close" src="/static/images/close.png" v-if="tel.length > 0" @click="deleteTel"></image>
		</view>
		<view class="input_wrap">
			<input placeholder="验证码" :value="code" @input="getCode" type="number" placeholder-class="gray" maxlength="4"></input>
			<text class="get_code" @click="requestCode" v-if="isOvertime">获取验证码</text>
			<text class="get_code prevent" v-if="!isOvertime">重新发送({{time}})s</text>
		</view>
		<view class="agree">首次登录自动创建账号，并默认同意<view @click="goAgreement" class="agreement">《香哈用户协议》</view>
		</view>
		<view :class="'login ' + (isLogin ? 'login-btn' : '')" @click="login">登录</view>
		<!-- #ifdef MP-BAIDU -->
		<view class="bd-login" @click="bdLogin">百度授权快捷登录</view>
		<!-- #endif -->
	</view>

</template>

<script>
	import {
		request
	} from '@/utils/request';
	import utils from '@/utils/util';
	import store from '@/store/index.js';

	export default {
		data() {
			return {
				tel: '',
				code: '',
				isOvertime: true,
				time: 60,
				publicKey: '',
				sendTimer: '',
				isLogin: false,
				path:'',
			};
		},

		onUnload() {
			clearInterval(this.sendTimer);
		},
		onLoad(options){
			this.path = options.path
		},
		methods: {
			goAgreement() {
				utils.xhNavigateTo('/pages/agreement');
			},

			telphone(el) {
				this.tel = el.detail.value;
			},

			getCode(el) {
				this.code = el.detail.value;
			},

			deleteTel() {
				this.tel = '';
			},

			login() {
				if (this.tel.length == 11) {
					if (this.code.length == 4) {

						request("/v1/login/login?", {
							tel: this.tel,
							verifyCode: this.code
						}).then(res => {
							if (res.code == 10000 && res.data) {
								store.commit("setUserInfo", res.data)
								uni.showToast({
									title: '登录成功',
									icon: 'none',

								});
								this.back();
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none',

								});
							}
						});
					} else {
						uni.showToast({
							title: '请输入验证码',
							icon: 'none',

						});
					}
				} else {
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none',

					});
				}
			},

			requestCode() {
				if (this.tel.length != 11) {
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none',

					});
				} else {
					this.code = '';
					this.isLogin = true;
					this.timeReduce();
					this.sendVerifyCode(this.tel);
				}
			},

			sendVerifyCode(tel) {
				request("/v1/login/sendVerifyCode?", {
					tel: this.tel
				}).then(res => {
					if (res.code == 10000) {
						uni.showToast({
							title: '验证码已发送',
							icon: 'none',

						});
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',

						});
						this.isOvertime = true;
						this.time = 60;
						clearInterval(this.sendTimer);
					}
				});
			},

			bdLogin() {
			    uni.login({
			      success: res => {
			        request('/V1/Login/getSessionKey?', {
			          code: res.code
			        }).then(res => {
			          if (res.code == 10000 && res.data) {
			            this.session_key = res.data.session_key;
			            this.record_id = res.data.record_id;
			            this.open_id = res.data.open_id;
			            if (res.data.is_login == 2) {
										store.commit("setUserInfo", res.data)
			              this.back();
			            } else {
			              uni.getPhoneNumber({
			                success: res => {
			                  request('/V1/Login/loginByBdAuth?', {
			                    encrypted_json: JSON.stringify(res),
			                    record_id: this.record_id,
			                    session_key: this.session_key,
			                    open_id: this.open_id
			                  }).then(res => {
			                    if (res.code == 10000 && res.data) {
														store.commit("setUserInfo", res.data)
			                      this.back();
			                    }
			                  });
			                },
			                fail: res => {
			                  uni.showToast({
			                    title: '获取手机号失败，请稍等片刻~',
			                    icon: 'none',
			                    duration: 3000,
			                    mask: true
			                  });
			                }
			              });
			            }
			          }
			        });
			      },
			      fail: err => {
			        console.log('login fail', err);
			      }
			    });
			  },
			
			timeReduce() {
				if (!this.isOvertime) {
					return false;
				}

				this.isOvertime = false;
				this.sendTimer = setInterval(() => {
					this.isOvertime = false;
					this.time--;

					if (this.time < 0) {
						this.isOvertime = true;
						this.time = 60;
						clearInterval(this.sendTimer);
					}
				}, 1000);
			},

			back() {
				if(this.path){
					uni.switchTab({
						url: '/' + this.path
					})
				}else{
					uni.navigateBack({
						delta: 1
					});
				}
			},
		},
	};
</script>
<style lang="less">
	.login_page {
		padding: 96rpx 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.title {
			font-size: 52rpx;
			color: #333333;
			margin: 29rpx;
			font-weight: bold;
		}

		.input_wrap {
			box-sizing: border-box;
			height: 109rpx;
			border-bottom: 1rpx solid #f2f2f2;
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-bottom: 20rpx;
			align-items: flex-end;

			.gray {
				font-size: 36rpx;
				color: #b8b9bb;
			}

			.get_code {
				border: 2rpx solid #fa273b;
				border-radius: 6rpx;
				padding: 6rpx 16rpx;
				font-size: 24rpx;
				color: #f23030;
				width: 190rpx;
				text-align: center;
			}

			.prevent {
				color: #b8b9bb;
				border: none;
			}

			.close {
				width: 15px;
				height: 15px;
			}
		}

		.agree {
			width: 100%;
			margin-top: 21rpx;
			text-align: left;
			font-size: 22rpx;
			color: #999999;
			display: flex;
			flex-wrap: wrap;

			.agreement {
				color: #151515;
				font-size: 22rpx;
			}
		}

		.login {
			margin: 103rpx auto 53rpx;
			width: 100%;
			border-radius: 80rpx;
			height: 80rpx;
			text-align: center;
			font-size: 34rpx;
			color: #ffffff;
			line-height: 80rpx;
			background: #bbbbbb;
			box-shadow: 0 2px 6px 0 #d7d7d7;
		}

		.bd-login {
			background-color: #3b77fb;
			color: #ffffff;
			width: 100%;
			border-radius: 80rpx;
			height: 80rpx;
			text-align: center;
			font-size: 34rpx;
			line-height: 80rpx;
			box-shadow: 0 2px 6px 0 #d7d7d7;
		}

		.login-btn {
			background: #fa273b;
			box-shadow: 0 4rpx 6rpx 0 #ff938e;
		}

		.baidu {
			font-size: 30rpx;
			color: #333333;
			text-decoration: underline;
		}
	}
</style>
