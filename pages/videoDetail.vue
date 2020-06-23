<template>

	<view class="recipe-detail-page">

		<view class="con">
			<block :class="'video-cloum ' + (model.video.width/model.video.height <= 1 ? '' : 'video-row')">
				<video :class="'video-cloum ' + (model.video.width/model.video.height <= 1 ? '' : 'video-row')" :src="model.video.url"
				 :poster="model.video.img" controls="true" objectFit="contain" autoplay="true" :id="model.code">
				</video>
			</block>
			<view class="kc-info">
				<!-- 作者头像&&作者简介 -->
				<view class="kc-author-info-box clearfix">
					<view class="author-head-box">
						<image v-if="!model.customer.img" class="author-head" src="/static/images/user-defa-icon.png"></image>
						<image v-else class="author-head" :src="model.customer.img">
							<image v-if="model.customer.isGiurmet" class="msj-icon" src="/static/images/meishijia-yuan-icon.png"></image>
						</image>
					</view>
					<view class="author-info">
						<text class="name ellipsis">{{model.customer.nickName}}</text>
						<view class="qm ellipsis">{{model.allClick}}次观看</view>
					</view>
					<view class="sc-btn sc-gray" @click="setLike" v-if="model.isFav == 2">已收藏</view>
					<view class="sc-btn" @click="setLike" v-else>收藏</view>
				</view>
				<view class="video-title">
					{{model.name}}
				</view>
				<view class="comment" v-if="model.comment.content">
					<text class="name">{{model.comment.customer.nickName}}:</text>
					<text class="contnet">{{model.comment.content}}</text>
					<!-- <view class="go-comment" @click="goComment(model.code,model.commentNum)" v-if="model.commentNum > 1">
						查看{{model.commentNum}}条评论>>
					</view> -->
				</view>
			</view>
			<!-- 相关菜谱 -->
			<view class="recomm-box" v-if="recipeList.length">
				<view class="recomm-title-box clearfix">
					<view class="title">热门推荐</view>
				</view>
				<block v-for="(item,index) in recipeList" :key="index">
					<view class="ad-wrap" v-if="index == 0 && showAd">
						<xhAdBox :adPos = '"recommend1"' :show="showAd"></xhAdBox>
					</view>
					<view class="ad-wrap" v-if="index == 5 && showAd">
						<xhAdBox :adPos = '"recommend2"' :show="showAd"></xhAdBox>
					</view>
					<view class="ad-wrap" v-if="index == 11 && showAd">
						<xhAdBox :adPos = '"recommend3"' :show="showAd"></xhAdBox>
					</view>
					<picTextCard :item="item" @click="navTo('/pages/videoDetail?dishCode=' + item.code,'redirect')" />
				</block>
				<bottomLoadMore :show="!showBottomText"></bottomLoadMore>
				<bottomText :show="showBottomText"></bottomText>

			</view>
		</view>

	</view>

</template>

<script>
	import tip from '@/utils/tip';
	import utils from '@/utils/util';
	
	import {
		request
	} from '@/utils/request';
	import BottomLoadMore from "@/components/common/bottomLoadMore";
	import BottomText from '@/components/common/bottomText';
	import picTextCard from '@/components/common/picTextCard.vue';
	import xhAdBox from '@/components/common/xhAdBox.vue';

	export default {
		data() {
			return {
				userInfo: {},
				oCode: {},
				model: {},
				showBottomText: false,
				recipeList: [],
				page: 1,
				videoContext: null,
				showAd:true,
			}
		},
		components: {
			BottomText,
			BottomLoadMore,
			picTextCard,
			xhAdBox
		},
		
		

		onLoad(options) {
			this.userInfo = this.$store.state.userInfo;
			this.oCode.dishCode = options.dishCode;
			this.getModel();
			this.getRecipeList();

		},

		methods: {
			getModel() {
				tip.loading();
				request("/v1/index/videoInfo?code=" + this.oCode.dishCode).then(res => {
					if (res.code == 10000 && res.data) {
						this.model = res.data;
						tip.loaded();
					}
				});
			},
			// 请求相关推荐数据
			getRecipeList() {
				request("/v1/index/hotRecom?code=" + this.oCode.dishCode + '&page=' + this.page).then(res => {
					if (res.code == 10000 && res.data) {
						this.recipeList = [...this.recipeList, ...res.data.list];
						if (res.data.isEnd == 2) {
							this.showBottomText = true;
						}
					}
				});
			},

			// 收藏
			setLike() {
				let that = this;
				if (!that.userInfo.code) {
					utils.xhNavigateTo('/pages/login?');
					return;
				}
				let params = {
					code: this.oCode.dishCode,
					type: 7,
					typeName: this.model.name
				};
				request("/v1/fav/setFav?", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.model.isFav = res.data;
						if (res.data == 2) {
							tip.toast('收藏成功');
							this.$store.commit('changeVideoData',{
								type:'add',
								dish: that.model,
							});
						} else {
							tip.toast('取消成功');
							this.$store.commit('changeVideoData',{
								type:'del',
								dish: that.model,
							});
						}
					}
				});
			},
			// 触底事件
			onReachBottom() {
				if (this.showBottomText) return false;
				this.page++;
				this.getRecipeList();
			},
			
			goComment(code, num) {
				utils.xhNavigateTo('/pages/comment?type=2&code=' + code);
			},

			goPage() {
				utils.xhNavigateTo('/pages/comment?type=2&keyBoard=2&code=' + this.model.code);
			},

			goHome() {
				wepy.switchTab({
					url: '/pages/home?'
				});
			},

			// 页面跳转
			navTo(url, openType) {
				this.videoContext = uni.createVideoContext(this.model.code);
				this.videoContext.pause();
				utils.xhNavigateTo(url, openType);
			},

		}
	};
</script>
<style lang="less">
	// 视频页面
	.recipe-detail-page {
		height: 100vh;

		.con {
			.kc-info {
				padding: 0 40rpx;
				background: #ffffff;

				.kc-title {
					display: block;
					line-height: 56rpx;
					padding-top: 40rpx;
					padding-bottom: 14rpx;
					text-align: left;
					font-size: 46rpx;
					font-weight: 700;
					color: #444444;
				}

				.kc-data {
					margin-top: 14rpx;
					margin-bottom: 44rpx;
					text-align: left;
					font-size: 26rpx;
					color: #999999;
				}

				.kc-author-info-box {
					padding: 44rpx 0 0;
					display: flex;
					position: relative;

					.author-head-box {
						position: relative;
					}

					.author-head {
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
						vertical-align: middle;

						.msj-icon {
							position: absolute;
							bottom: 3rpx;
							right: -4rpx;
							width: 32rpx;
							height: 32rpx;
							z-index: 999;
						}
					}

					.author-info {
						width: 410rpx;
						margin-left: 28rpx;
						position: relative;
						height: 96rpx;

						.name {
							display: inline-block;
							font-size: 30rpx;
							color: #444444;
							height: 50rpx;
							line-height: 56rpx;
							// padding-top: 14rpx;
						}

						.qm {
							width: 88%;
							font-size: 24rpx;
							color: #999999;
							height: 50rpx;
							line-height: 48rpx;
						}
					}

					.sc-btn {
						width: 200px;
						height: 52px;
						line-height: 52px;
						text-align: center;
						font-size: 28px;
						color: #ffffff;
						background: #fd2846;
						margin-top: 12rpx;
						border-radius: 6px;
						transform: scale(0.5);
						transform-origin: 100% 0%;
					}

					.sc-gray {
						background: #bbb;
					}

					button::after {
						border: 0 none;
					}
				}

				.author-say {
					font-size: 34rpx;
					line-height: 52rpx;
					padding-bottom: 56rpx;
					text-align: justify;
				}
			}
		}

		.recomm-box {
			margin-top: 27rpx;
			background: #ffffff;
			padding-bottom: 0rpx;

			.recomm-title-box {
				padding: 40rpx 40rpx 0;

				.title {
					font-size: 36rpx;
					font-weight: 700;
					color: #444444;
				}

				.more {
					float: right;
					font-size: 26rpx;
					color: #999999;
					padding-top: 8rpx;
				}
			}
		}

		.video-cloum {
			width: 100%;
			height: 750rpx;
			background-color: #000000;
		}

		.video-row {
			width: 100%;
			height: 423rpx;
			background-color: #000000;
		}

		.video-title {
			font-size: 32rpx;
			color: #333333;
			line-height: 46rpx;
			margin: 32rpx 0rpx;
		}

		.comment {
			background: #f5f5f5;
			border-radius: 8rpx;
			padding: 22rpx 25rpx 17rpx;

			.name {
				font-size: 28rpx;
				color: #3e3e3e;
				letter-spacing: 0;
				line-height: 36rpx;
				font-weight: 700;
			}

			.contnet {
				font-size: 28rpx;
				color: #3e3e3e;
				letter-spacing: 0;
				line-height: 36rpx;
			}

			.go-comment {
				font-size: 26rpx;
				color: #1f83c6;
				padding-top: 12rpx;
			}
		}
	}
	.ad-wrap{
		margin: 36rpx 40rpx;
	}
</style>
