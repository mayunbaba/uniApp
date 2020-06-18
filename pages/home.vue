<template>
	<view>
		<searchBar></searchBar>
		<view class="content-box">
			<view class="top-info-wrap">
				<!--精选菜单-->
				<swiper class="swiper home-swiper-box" :indicator-active-color="indicatorActiveColor" :indicator-dots="indicatorDots"
				 :autoplay="autoplay" :interval="interval" :duration="duration" :circular="true">
					<block v-for="(item,index) in modelList.topic" :key="item.key" :index="index">
						<block v-if="item.navType !== 'contact'">
							<swiper-item>
								<navigator class="recommend-hot-box br-4" :url="item.url" hover-class="none">
									<image :src="item.img" class="item-img" mode="aspectFill"></image>
									<text class="mask" v-if="item.type == 2"></text>
									<view class="text-box center">
										<text class="text-top">{{item.title}}</text>
										<text class="text-bot">{{item.dishNum}}</text>
									</view>
								</navigator>
							</swiper-item>
						</block>
					</block>
				</swiper>
				<!--三餐and视频菜谱-->
				<view class="sanvideo-box">
					<view class="item br-4" v-for="(item,index) in modelList.nav" :key="item.key" @click="navTo(item.url+'')">
						<image :src="item.img" class="image-con"></image>
						<view class="con-1">{{item.text1}}</view>
						<view class="con-2">{{item.text2}}</view>
					</view>
				</view>
				<!--热门推荐 -->
				<view class="shicai-box" v-if="modelList.cate.text1">
					<view class="top">
						<text class="title">{{modelList.cate.text1}}</text>
						<navigator class="more" url="/pages/classify" hover-class="none" open-type="switchTab">查看全部</navigator>
					</view>
					<view class="con clearfix">
						<view class="con-item" v-for="(item,index) in modelList.cate.list" :key="index">
							<view @click="navTo('/pages/search?code='+item.name)">
								<image class="img-con br-8" :src="item.img"></image>
								<text class="mask br-8"></text>
								<image class="shadow br-8" src="/static/images/shadow.png"></image>
								<text class="text">{{item.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<HomeTab :scrollActive ="scrollActive"></HomeTab>
		</view>
	</view>
</template>

<script>
	import utils from "@/utils/util";
	import searchBar from '@/components/search/searchBar.vue';
	import HomeTab from '@/module/homeTab.vue'
	import {
		request
	} from '@/utils/request.js';
	export default {
		components: {
			searchBar,
			HomeTab,
		},
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 300,
				indicatorColor: 'rgba(0, 0, 0, .3)',
				indicatorActiveColor: '#fff',
				modelList: {},
				scrollActive:false,
				// 设置默认值，以防获取不到
				pos:{
					"searchH":53,
					"tabsT":482
				}
			}
		},
		onLoad() {
			this.initData();
		},
		created() {
			this.$nextTick(() => {
				// this.$children[0] 角标为组件在页面的引入顺序
				let query = uni.createSelectorQuery();
				query
					// #ifdef MP-WEIXIN
					.in(this.$children[1].$children[0])
					// #endif
					.select('.tabs-wrap')
					.boundingClientRect(rect => {
						console.log(rect);
						if(rect){
							this.pos.tabsT = rect.top;
						}
					})
					// #ifdef MP-WEIXIN
					.in(this.$children[0])
					// #endif
					.select('.go-search')
					.boundingClientRect(rect => {
						console.log(rect);
						if(rect){
							this.pos.searchH = rect.height;
						}
					})
					.exec();
			})
		},
		onPageScroll(e){
			if(e.scrollTop > this.pos.tabsT - this.pos.searchH - 15){
				this.scrollActive = true;
			}else{
				this.scrollActive = false;
			}
		},
		methods: {
			initData() {
				request("/baidu/v1/index/recommend").then(res => {
					this.modelList = res.data;
				})

			},
			// 页面跳转
			navTo(url) {
				utils.xhNavigateTo(url);
			},
			onReachBottom(){
				console.log('bottom');
			}

		}
	}
</script>

<style lang="less">
	.top-info-wrap{
		width: 100%;
		height: 850rpx;
	}
	/*头部tab分页*/
	.content-box {
		width: 100%;
		margin-top: 104rpx;
		background: #f3f3f3;
		box-sizing: border-box;
		overflow-y: hidden;

		.home-swiper-box {
			width: 100%;
			height: 375rpx;

			.recommend-hot-box {
				.item-img {
					width: 100%;
					height: 375rpx;
					vertical-align: top;
				}
			}

			.wx-swiper-dot {
				width: 6px;
				height: 6px;
			}
		}

		.sanvideo-box {
			overflow: hidden;
			height: 140rpx;
			padding: 40rpx 40rpx 38rpx;
			background: #ffffff;
			color: #000;

			.item {
				position: relative;
				width: 325rpx;
				height: 140rpx;
				background: #f3f3f3;

				.image-con {
					position: absolute;
					top: 0;
					right: 0;
					width: 172rpx;
					height: 140rpx;
				}

				.con-1 {
					font-size: 30rpx;
					font-weight: 700;
					color: #444444;
					position: absolute;
					left: 26rpx;
					top: 34rpx;
				}

				.con-2 {
					font-size: 22rpx;
					color: #999999;
					position: absolute;
					left: 26rpx;
					top: 80rpx;
				}

				&:nth-child(1) {
					float: left;
				}

				&:nth-child(2) {
					float: right;
				}
			}
		}

		.shicai-box {
			padding: 0 40rpx;
			background: #ffffff;

			.top {
				overflow: hidden;

				.title {
					float: left;
					font-size: 32rpx;
					font-weight: 700;
					color: #444444;
				}

				.more {
					float: right;
					font-size: 26rpx;
					height: 48rpx;
					line-height: 54rpx;
					color: #999999;
				}
			}

			.con {
				width: 100%;
				height: 150rpx;
				padding: 20rpx 0 40rpx;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;

				.con-item {
					width: 150rpx;
					height: 150rpx;
					margin-right: 23.33rpx;
					position: relative;
					overflow: hidden;

					&:nth-last-child(1) {
						margin-right: 0;
					}

					.img-con {
						position: relative;
						width: 100%;
						height: 150rpx;
					}

					.mask {
						display: block;
						width: 100%;
						height: 100%;
						background: rgba(0, 0, 0, 0.02);
						position: absolute;
						left: 0;
						top: 0;
					}

					.shadow {
						width: 100%;
						height: 50%;
						position: absolute;
						left: 0;
						bottom: 0;
					}

					.text {
						position: absolute;
						bottom: 11rpx;
						width: 100%;
						text-align: center;
						font-size: 28rpx;
						color: #fff;
						left: 0;
						font-weight: 500;
					}
				}
			}
		}

	}

	.recommend-hot-box {
		display: inline-block;
		width: 100%;
		height: auto;
		margin-right: 24rpx;
		position: relative;

		&:nth-last-child(1) {
			margin-right: 0;
		}

		.mask {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			background: rgba(0, 0, 0, 0.05);
		}

		.recommend-hot-image {
			position: relative;
			width: 100%;
			color: #000;
		}

		.text-top {
			display: block;
			width: 500rpx;
			text-align: center;
			color: #fff;
			font-weight: 700;
			font-size: 40rpx;
			white-space: pre-line;
			display: block;

			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-height: 50rpx;
		}

		.text-bot {
			display: block;
			margin: 0 auto;
			width: 500rpx;
			text-align: center;
			font-size: 28rpx;
			color: #fff;
			padding-top: 12rpx;
		}

		.center {
			position: absolute;
			left: 50%;
			top: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
		}
	}
</style>
