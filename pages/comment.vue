<template>

	<view class="comment-page">
		<view class="mask" v-if="keyBoard">
			<view @click.stop="closeKeyBoard()" class="mask-content"></view>
		</view>
		<view class="video-info" v-if="from == 2">
			<view class="lt">{{videoInfo.title}}</view>
			<view class="rt" @click="goVideoDetail">查看详情>></view>
		</view>
		<view class="pb-20">
			<view class="comment-wrap" v-for="(item, index) in commentList" :key="index" @click.stop="goReply(item,'first',index,'')">
				<image class="head" :src="(item.customer.header_img ? item.customer.header_img : '/static/images/user-defa-icon.png')"></image>
				<view class="comment">
					<view :class="item.color">
						<view class="nick-name">{{item.customer.nick_name}}</view>
						<view class="text">{{item.content[0].text}}</view>
						<view class="create-time">{{item.create_time}}</view>
					</view>

					<view class="reply" v-if="item.replay[0]">
						<view :class="'item ' + ($item.replay_id == replayId ? 'yellow' : '')" v-for="($item, index2) in item.replay"
						 :key="index2" @click.stop="goReply($item,'second',index,$index)">
							<text class="uname">{{$item.uname}}</text>
							<text class="author" v-if="$item.is_author == 2">(作者)</text>
							<text class="huifu">回复</text>
							<text class="replay_uname">{{$item.replay_uname}}：</text>
							<text class="content">{{$item.content}}</text>
						</view>
						<view class="reply-num" v-if="item.replay_num > 0" @click.stop="'openReply(' + item.comment_id + ',' + index + ')'">展开{{item.replay_num}}条回复></view>
					</view>
				</view>
			</view>
		</view>
		<view class="comment-bottom" v-if="!keyBoard">
			<view class="input-view" @click.stop="goReply('','comment','','')">
				{{placeholderMsg}}
			</view>
		</view>
		<view v-else class="text-wrap">
			<input :placeholder="placeholderMsg" :focus="keyBoard" adjust-position="true" @input="bindinput" class="text" maxlength="150"
			 @confirm="sendComment" confirm-type="send"></input>
			 <!-- <input placeholder="{{placeholderMsg}}" focus="{{keyBoard}}" adjust-position="true"  bindinput="bindinput" class="text"  maxlength="150" bindconfirm="sendComment" confirm-type="send"></input> -->
			<view class="send-wrap" @touchstart="sendComment">
				<!-- <view :class="'send ' + (sendActive ? 'red-bg' : '') + ' ' + (isAndroid ? 'android-send' : '')">发送</view> -->
				<view :class='{"send":true,"red-bg":sendActive,"android-send":isAndroid}'>发送</view>
			</view>
		</view>

		<!--加载更多时动画-->
		<bottomLoadMore :show.sync="showLoading"></bottomLoadMore>
		<!--默认text-->
		<bottomText :show.sync="isEnd" :message.sync="message"></bottomText>
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

	export default {
		data() {
			return {
				showLoading: true,
				isAndroid: false,
				isEnd: false,
				sendActive: false,
				videoInfo: '',
				code: '',
				type: '',
				replayId: '',
				source: '',
				from: '',
				netType: '',
				keyBoardArg: '',
				commentList: [],
				commentId: '',
				keyBoard: false,
				message: '没有更多评论啦',
				placeholderMsg: '与哈友讨论交流吧～',
				comment: '',
				commentType: 'comment',
				//评论类型
				commentContent: '',
				//评论的信息
				commentIndex: '',
				//评论的一级位置
				commentSecondIndex: '' //评论的二级位置
			};
		},

		onLoad(options) {
			// 页面初始化 options为页面跳转所带来的参数
			tip.loading();
			this.code = options.code;
			this.type = options.type;
			this.commentId = options.commentId || '';
			this.replayId = options.replayId || '';
			this.source = options.source || '';
			this.from = options.from || 1;
			this.keyBoardArg = options.keyBoard;
			this.getComment();
			tip.loaded();
		},

		onReady() {},

		onShow() {
			this.isAndroid = uni.getStorageSync('isAndroid');
			this.getNetworkType();
			uni.setStorageSync('refreshMsg', {
				data: false
			});
		},

		mixins: [],
		components: {
			bottomLoadMore: BottomLoadMore,
			bottomText: BottomText,
		},
		props: {},
		methods: {
			async getNetworkType() {
				var that = this;
				uni.getNetworkType({
					success: function(res) {
						that.netType = res.networkType;

						if (res.networkType == 'none') {
							uni.showToast({
								title: '网络异常～',
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			},

			getComment() {
				this.showLoading = true;
				request('/v1/comment/commentList?type=' + this.type + '&code=' + this.code + '&from=' + this.from + '&commentId=' +
					this.commentId + '&replayId=' + this.replayId + '&source=' + this.source).then(res => {
					this.showLoading = false;

					if (res.code == 10000 && res.data) {
						if (res.data.isEnd == 2) {
							this.isEnd = true;
						}

						uni.setNavigationBarTitle({
							title: '共' + res.data.total + '条评论'
						});

						if (res.data.total == 0) {
							this.message = '暂无评论，抢沙发';
						} else {
							this.message = '没有更多评论啦';
						}

						this.videoInfo = res.data.info;
						this.commentList = [...this.commentList, ...res.data.list];

						if (this.from == 2) {
							if (this.replayId == '') {
								this.commentList[0].color = 'yellow';
								this.commentType = 'first';
								this.commentContent = this.commentList[0];
								this.commentSecondIndex = '';
							} else {
								var num = 0;
								this.commentList[0].replay.forEach((item, index) => {
									if (item.replay_id == this.replayId) {
										num = index;
										this.commentSecondIndex = index;
									}
								});
								this.commentType = 'second';
								this.commentContent = this.commentList[0].replay[num];
							}

							setTimeout(() => {
								this.keyBoard = true;
								this.sendActive = false;
								this.commentIndex = 0;

								if (this.commentType == 'first') {
									this.placeholderMsg = '回复' + this.commentContent.customer.nick_name;
								} else if (this.commentType == 'second') {
									this.placeholderMsg = '回复' + this.commentContent.uname;
								}
							}, 1000);
						}
					} else {
						uni.navigateBack({
							delta: 1
						});
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						});
					}
				});
			},

			bindinput(e) {
				this.comment = e.detail.value;

				if (this.comment.length > 0) {
					this.sendActive = true;

					if (this.comment.length > 150) {
						uni.showToast({
							title: '最多可输入150字',
							icon: 'none',
							duration: 2000
						});
					}
				} else {
					this.sendActive = false;
				}
			},

			openKeyBoard() {
				this.keyBoard = true;
			},

			closeKeyBoard() {
				this.keyBoard = false;
			},

			sendComment() {
				if (!this.isLogin()) return false;
				this.keyBoard = false;
				this.getNetworkType();
				if (!this.sendActive) return false;
				if (this.commentType == 'comment') {
					request('/v1/comment/comment?', {
						type: 2,
						code: this.code,
						content: JSON.stringify([{
							text: this.comment
						}])
					}).then(res => {
						if (res.code == 10000 && res.data) {
							this.commentList.unshift(res.data);
							uni.pageScrollTo({
								scrollTop: 0
							});
							uni.showToast({
								title: '评论成功',
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 2000
							});
						}
					});
				} else {
					var commentId = '';
					var replayUcode = '';

					if (this.commentType == 'first') {
						commentId = this.commentContent.comment_id;
						replayUcode = this.commentContent.customer.ucode;
					} else {
						commentId = this.commentList[this.commentIndex].comment_id;
						replayUcode = this.commentContent.ucode;
					}

					request('/v1/comment/reply?', {
						type: 2,
						code: this.code,
						commentId: commentId,
						content: this.comment,
						replayUcode: replayUcode
					}).then(res => {
						if (res.code == 10000 && res.data) {
							var arr = [res.data];
							this.commentList[this.commentIndex].replay = [...this.commentList[this.commentIndex].replay, ...arr];
							uni.showToast({
								title: '回复成功',
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 2000
							});
						}
					});
				}
			},

			isLogin() {
				if (!this.$store.state.userInfo.code) {
					utils.xhNavigateTo('/pages/login?');
					return false;
				}
				return true;
			},

			onReachBottom() {
				if (this.showLoading || this.isEnd) return false;
				this.commentId = this.commentList[this.commentList.length - 1].comment_id; // 置空锚点参数

				this.replayId = '';
				this.source = '';
				this.from = 1;
				this.getComment();
			},

			// 跳转到视频详情页
			goVideoDetail() {
				utils.xhNavigateTo('/pages/videoDetail?dishCode=' + this.code);
			},

			// 开启键盘
			goReply(item, arg, index, $index) {
				this.openKeyBoard();
				this.sendActive = false;
				this.commentType = arg;
				this.commentContent = item;
				this.commentIndex = index;
				this.commentSecondIndex = $index;

				if (arg == 'first') {
					this.placeholderMsg = '回复' + item.customer.nick_name;
				} else if (arg == 'second') {
					this.placeholderMsg = '回复' + item.uname;
				} else {
					this.placeholderMsg = '与哈友讨论交流吧～';
				}
			},

			//展开评论
			openReply(commentId, index) {
				request('/v1/comment/replayList?type=' + this.type + '&code=' + this.code + '&from=1' + '&commentId=' + commentId).then(
					res => {
						this.showLoading = false;

						if (res.code == 10000 && res.data) {
							this.commentList[index].replay = res.data;
							this.commentList[index].replay_num = 0;
						}
					});
			}

		},
		computed: {},
		watch: {}
	};
</script>
<style lang="less">
	.comment-page {
		padding: 0 0rpx 120rpx;
		background-color: #fff;
		overflow: hidden;

		.pb-20 {
			padding: 21rpx 40rpx 20rpx;
		}

		.comment-wrap {
			padding-top: 19rpx;
			display: flex;

			.head {
				width: 84rpx;
				height: 84rpx;
				border-radius: 50%;
				margin-right: 22rpx;
				margin-top: 8rpx;
				background-color: #f3f3f3;
			}
		}

		.comment {
			width: 564rpx;
			border-bottom: 0.5rpx solid #f5f5f5;

			.nick-name {
				font-size: 28rpx;
				color: #999999;
			}

			.text {
				font-size: 28rpx;
				color: #3e3e3e;
			}

			.create-time {
				font-size: 24rpx;
				color: #bbbbbb;
				margin-top: 4rpx;
				margin-bottom: 19rpx;
			}

			.reply {
				box-sizing: border-box;
				margin-top: 4rpx;
				padding: 16rpx 14rpx;
				width: 100%;
				background: #f5f5f5;
				border-radius: 6rpx;
				margin-bottom: 29rpx;

				.item {
					margin-bottom: 4rpx;

					text {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #000000;
						margin-right: -4rpx;
					}

					.uname {
						color: #999;
					}

					.replay_uname {
						color: #999;
					}

					.author {
						color: #6e3532;
					}
				}

				.reply-num {
					margin-top: 3rpx;
					font-size: 28rpx;
					color: #1f83c6;
					margin-bottom: 3rpx;
				}
			}
		}

		.yellow {
			background: #fffddf;
		}

		.comment-bottom {
			box-sizing: border-box;
			width: 100%;
			height: 120rpx;
			background-color: #fff;
			position: fixed;
			z-index: 100;
			left: 0;
			bottom: 0;
			padding: 24rpx 40rpx;
			border-top: 0.5px solid #e0e0e0;

			.input-view {
				box-sizing: border-box;
				width: 100%;
				height: 72rpx;
				line-height: 72rpx;
				background: #eeeeee;
				border-radius: 72rpx;
				padding-left: 30rpx;
				font-size: 32rpx;
				color: #999999;
			}
		}

		.text-wrap {
			box-sizing: border-box;
			padding: 0 0 0 40rpx;
			width: 100%;
			position: fixed;
			z-index: 100;
			left: 0;
			bottom: 0;
			background-color: #fff;
			border-top: 0.5px solid #e0e0e0;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.text {
				width: 530rpx;
				height: 96rpx;
			}

			.send-wrap {
				padding: 15rpx 40rpx;
			}

			.send {
				width: 108rpx;
				height: 60rpx;
				background-color: #c4c4c4;
				border-radius: 60rpx;
				font-size: 28rpx;
				line-height: 60rpx;
				text-align: center;
				color: #ffffff;
			}

			.android-send {
				line-height: 65rpx;
			}

			.red-bg {
				background-image: linear-gradient(-225deg, #f6496c 0%, #fa273b 100%);
			}
		}

		.mask {
			position: fixed;
			width: 100%;
			height: 100vh;
			box-sizing: border-box;
			padding-bottom: 100rpx;
			top: 0;
			left: 0;
			z-index: 10;

			.mask-content {
				width: 100%;
				height: 100%;
			}
		}

		.video-info {
			box-sizing: border-box;
			background: #f5f5f5;
			width: 100%;
			height: 84rpx;
			padding: 0 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.lt {
				font-size: 28rpx;
				color: #333333;
				width: 336rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.rt {
				font-size: 28rpx;
				color: #1f83c6;
			}
		}
	}
</style>
