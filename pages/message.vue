<template>

	<view>
		<noLogin :show="showNoLogin" :text="text" :imgSrc="imgSrc" :button="button" :buttonUrl="buttonUrl" :islogin="islogin"></noLogin>
		<view v-if="!showNologin">
			<scroll-view scroll-y class="message-page" v-if="!showNologin" @scrolltolower="lower" lower-threshold="150">
				<!--加载更多时动画-->
				<view class="message-wrap">
					<view :class="'message-item ' + (item.state == 1 ? 'bg-yellow' : '')" v-for="(item, index) in msgList" :key="index"
					 @click="goComment(item,index)">
						<image :src="item.customer.img" class="header-img" mode="aspectFit"></image>
						<view class="r-item">
							<view class="message">
								<view class="user-wrap">
									<view class="nick-name">{{item.customer.nickName}}</view>
									<!-- <view class="star">赞了你的作品</view> -->
								</view>
								<view class="comment-content">{{item.content}}</view>
								<view class="time">{{item.time}}</view>
							</view>
							<image :src="item.img" class="cover" mode="aspectFit"></image>
						</view>
					</view>
					<!--加载更多时动画-->
					<bottomLoadMore :show="showLoading"></bottomLoadMore>
					<!--默认text-->
					<bottomText :show="showBottomText"></bottomText>
				</view>
			</scroll-view>
		</view>
		<custom-tab-bar></custom-tab-bar>
	</view>


</template>

<script>
	import tip from "@/utils/tip";
	import utils from "@/utils/util";
	import {
		request
	} from '@/utils/request.js';
	import BottomLoadMore from "@/components/common/bottomLoadMore";
	import BottomText from "@/components/common/bottomText";
	import NoLogin from '@/module/noLogin.vue';

	export default {
		data() {
			return {
				userInfo: '',
				lastId: '',
				//滚动条高度
				msgList: [],
				//消息列表
				refresh: false,
				showLoading: false,
				//是否显示 底部loading
				showTopLoading: false,
				isOk: true,
				//防止重复加载
				showBottomText: false,
				//是否展示text
				showNoLogin: false,
				islogin: false,
				//是否已经登录
				hasMore: true,
				text: '登录后，查收消息通知',
				imgSrc: '/static/images/no-login.png',
				button: '登录',
				buttonUrl: '/pages/login?'
			};
		},

		onLoad() {
			tip.loading();
			this.getUserInfo();
			if (this.islogin) {
				this.getMsgList();
			}
		},
		onShow(){
			this.$store.commit('setMsgNum','0');
		},
		components: {
			bottomLoadMore: BottomLoadMore,
			bottomText: BottomText,
			noLogin: NoLogin
		},
		props: {},
		methods: {
			getUserInfo() {
				this.userInfo = this.$store.state.userInfo;
				if (!this.userInfo.code) {
					this.showNoLogin = true;
					this.islogin = false;
					tip.loaded();
				} else {
					this.islogin = true;
				}
			},

			getMsgList(arg) {
				request('/v1/message/msgList?', {
					lastId: this.lastId
				}).then(res => {
					tip.loaded();
					if (res.code == 10000) {
						this.isOk = true;
						this.showLoading = false;
						this.refresh = true;
						this.hasMore = res.data.isEnd == 1 ? true : false;
						if (arg == 'refresh') {
							this.showTopLoading = false;
							 uni.stopPullDownRefresh();
							uni.showToast({
								title: '更新成功',
								icon: 'none',
								duration: 1000
							});
						}
						this.msgList = [...this.msgList, ...res.data.list];
						if (this.msgList.length == 0) {
							this.imgSrc = '/static/images/no-message.png';
							this.text = '您还未收到任何消息~';
							this.button = '与哈友互动交流';
							this.buttonUrl = '/pages/home?';
							this.showNoLogin = true;
						} else {
							this.showNoLogin = false;
						}
						if (!this.hasMore && !this.showNoLogin) {
							this.showBottomText = true;
						}
					}
				});
			},

			// 评论页面
			goComment(item, index) {
				utils.xhNavigateTo('/pages/comment?type=' + item.params.type + '&code=' + item.params.code + '&commentId=' + item.params
					.commentId + '&replayId=' + item.params.replayId + '&source=' + item.params.source + '&from=' + item.params.from);
			},

			onPullDownRefresh() {
				if (!this.isOk) {
					return;
				}
				this.isOk = false;
				this.showTopLoading = true;
				this.lastId = '';
				this.hasMore = true;
				tip.loading();
				this.msgList = [];
				this.getMsgList('refresh');
			},
			lower() {
				if (!this.hasMore) {
					this.showLoading = false;
					return;
				}
				this.showLoading = true;
				if (!this.isOk) {
					return;
				}
				this.isOk = false;
				this.lastId = this.msgList[this.msgList.length - 1].id;
				this.getMsgList();
			}
		},
	};
</script>
<style lang="less">
	.message-page {
		width: 100vw;
		height: calc(100vh - 48px);

		.message-wrap {
			padding-bottom: 20rpx;
		}

		.message-item {
			padding: 24rpx 0rpx 0 40rpx;
			background: #fff;
			display: flex;

			.header-img {
				width: 70rpx;
				height: 70rpx;
				border-radius: 50%;
				margin: 8rpx 18rpx 0 0;
			}

			.r-item {
				width: 622rpx;
				padding-right: 40rpx;
				min-height: 141rpx;
				box-sizing: border-box;
				border-bottom: 0.5px solid #f5f5f5;
				display: flex;
				justify-content: space-between;

				.message {
					display: flex;
					flex-direction: column;
					width: 458rpx;

					.user-wrap {
						display: flex;

						.nick-name {
							font-size: 28rpx;
							color: #999999;
						}

						.star {
							margin-left: 14rpx;
							font-size: 28rpx;
							color: #999999;
						}
					}

					.comment-content {
						width: 400rpx;
						word-break: break-all;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 4;
						-webkit-box-orient: vertical;
					}

					.time {
						margin-top: 10rpx;
						margin-bottom: 14rpx;
						font-size: 24rpx;
						color: #999999;
					}
				}

				image {
					width: 116rpx;
					height: 116rpx;
					border-radius: 8rpx;
				}
			}
		}

		.bg-yellow {
			background: #fefce3;
		}
	}

	.h-0 {
		height: 0vh;
	}
</style>
