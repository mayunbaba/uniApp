<template>
	<view class="user_page">
		<noLogin :show="showNoLogin"></noLogin>
		<view v-if="!showNoLogin">
			<!-- 顶部用户信息 -->
			<view class="header">
				<view class="user-info">
					<image :src="userInfo.img"></image>
					<view class="nick-name">{{userInfo.nickName}}</view>
				</view>
				<text @click="logout" class="logout">退出</text>
			</view>
			<!-- 收藏模块 -->
			<view class="no-fav" v-if="favNum == 0">
				<image src="/static/images/no-fav.png"></image>
				<view class="tips">你还未收藏任何内容~</view>
			</view>
			<view class="fav" v-else>
				<view class="fav-title">我的收藏</view>
				<view class="feed" id="nav">
					<xhtabs>
						<xhtab :title="item.name" :name="index" v-for="(item,index) in tabList" :key="item.name" activeColor="red" v-model="activeIndex"
						 @click="tabChange"></xhtab>
					</xhtabs>
					<block v-for="(item,index) in favData" :key="index" v-if="index === activeIndex">
						<scroll-view :scroll-y="scrollActive" @scrolltolower="getFavList" class="scroll-wrap">
							<WaterFall :allData="item" :index="index" :col="2"></WaterFall>
							<!--加载更多时动画-->
							<bottomLoadMore :show="!finished[index]"></bottomLoadMore>
							<!--默认text-->
							<bottomText :show="finished[index]"></bottomText>
						</scroll-view>
					</block>

				</view>
			</view>

		</view>
		<custom-tab-bar></custom-tab-bar>
	</view>
</template>

<script>
	import {
		request
	} from "@/utils/request.js";
	import noLogin from '@/module/noLogin.vue';
	import store from '@/store/index.js';
	import tip from '@/utils/tip';
	import xhtabs from '@/components/tabs/Tabs.vue';
	import xhtab from '@/components/tabs/Tab.vue';
	import BottomLoadMore from "@/components/common/bottomLoadMore";
	import BottomText from "@/components/common/bottomText";
	import WaterFall from "@/components/waterFall/WaterFall.vue";
	import {mapState} from 'vuex';
	

	export default {
		data() {
			return {
				userInfo: '',
				favNum: 0,
				showNoLogin: false,
				scrollActive: false,
				activeIndex: 0,
				tabList: [],
				page: [],
				loading: [],
				finished: [],
				pos: {
					"tabsT": 0
				},
			}
		},
		components: {
			noLogin,
			xhtabs,
			xhtab,
			WaterFall,
			BottomLoadMore,
			BottomText,
		},
		computed:{
			...mapState(['favData'])
		},
		created() {
			if (store.state.userInfo.code) {
				this.showNoLogin = false;
				this.getMenuNum();
			} else {
				this.showNoLogin = true;
			}

		},
		onUnload(){
			console.log('unload');
		},
		destroyed(){
			console.log('destory');
		},
		methods: {
			// 获取用户信息和收藏数量
			getMenuNum(arg) {
				request('/baidu/v1/user/center?').then(res => {
					tip.loaded();
					if (res.code == 10000 && res.data) {
						let tabData = [];
						this.userInfo = res.data;
						this.favNum =
							parseInt(res.data.favDishNum) + parseInt(res.data.favShortVideoNum);
						this.tabList = res.data.myFav;
						// 初始化数据
						this.tabList.forEach((item, index) => {
							tabData[index] = [];
							this.page.push(0);
							this.finished.push(false);
						});
						this.$store.commit('initFavData',tabData);
						this.getFavList();
						// 获取到数据后，获取页面tab距离顶部距离
						this.$nextTick(() => {
							let query = uni.createSelectorQuery();
							query
								.select('#nav')
								.boundingClientRect(rect => {
									this.pos.tabsT = rect.top;
								})
								.exec();
						})
					}
				});
			},
			// 获取用户收藏数据
			getFavList() {
				if (this.loading[this.activeIndex]) return;
				if (this.finished[this.activeIndex]) return;
				this.loading[this.activeIndex] = true;
				this.page[this.activeIndex]++;
				this.$store.dispatch('setAllFavData',{
					type: this.tabList[this.activeIndex].type,
					page: this.page[this.activeIndex],
					index:this.activeIndex
				}).then(res=>{
					this.loading[this.activeIndex] = false;
					this.finished[this.activeIndex] = res.data.isEnd == 1 ? false : true;
					this.$set(this.finished,this.activeIndex,this.finished[this.activeIndex]);
				});
			},
			// tab切换
			tabChange(name) {
				this.activeIndex = name;
				if (this.favData[this.activeIndex].length === 0) {
					this.getFavList();
				}
			},
			logout() {
				store.commit("setUserInfo", {})
				// swan.removeTabBarBadge({
				// 	index: 2
				// });
				// 修改状态
				uni.reLaunch({
					url: '/pages/home'
				});
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > this.pos.tabsT - 15) {
				this.scrollActive = true;
			} else {
				this.scrollActive = false;
			}
		},
	};
</script>

<style lang="less">
	.scroll-wrap {
		width: 100%;
		box-sizing: border-box;
		height: calc(100vh - 89rpx - 48px);
		background-color: #FFFFFF;
		padding: 20rpx 40rpx;
	}

	.user_page {
		display: flex;
		flex-direction: column;
		background: #f6f6f6;

		.header {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			background-color: #fff;
			padding: 59rpx 40rpx;
			align-items: center;

			.user-info {
				display: flex;
				align-items: center;

				image {
					width: 90rpx;
					height: 90rpx;
					border-radius: 50%;
				}

				.nick-name {
					font-size: 32rpx;
					color: #3e3e3e;
					margin-left: 20rpx;
					font-weight: bold;
				}
			}

			.logout {
				border: 1px solid #979797;
				box-sizing: border-box;
				border-radius: 52px;
				width: 150px;
				height: 52px;
				text-align: center;
				line-height: 52px;
				font-size: 28px;
				color: #454545;
				transform: scale(0.5);
				transform-origin: 100% 50%;
			}
		}

		.fav {
			margin-top: 20rpx;
			background-color: #fff;
			overflow: hidden;

			.fav-title {
				padding: 48rpx 0 0 30rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
		}

		.feed {
			width: 100%;
			background-color: #fff;
			margin-top: 10rpx;

			.wrapper {
				box-sizing: border-box;
				width: 100%;
				height: 102rpx;
				background-color: rgba(255, 255, 255, 1);
				display: flex;
				padding: 0 30rpx;
				justify-content: flex-start;
				align-items: center;

				.item-tab {
					margin-right: 50rpx;
					font-size: 32rpx;
					line-height: 45rpx;
					height: 45rpx;
					// padding: 10rpx 10rpx;
					color: #333;
					// width: 25%;
					text-align: left;

					&.active {
						font-size: 36rpx;
						color: #333333;
						line-height: 50rpx;
						text-align: left;
						background: url('/static/images/rectangle.png') no-repeat center bottom;
						background-size: 76rpx;
						font-weight: bold;
					}
				}
			}

			.fixed {
				top: 0;
				position: fixed;
				z-index: 1000;
			}
		}

		.no-fav {
			margin-top: 20rpx;
			background-color: #fff;
			padding-top: 245rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			image {
				width: 258rpx;
				height: 160rpx;
				margin-bottom: 55rpx;
			}

			.tips {
				font-size: 28rpx;
				color: #9a9a9a;
			}
		}

		.page {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #fff;
		}

		.page .group {
			width: 132rpx;
			height: 146rpx;
			margin-top: 340rpx;
			margin-bottom: 49rpx;
		}

		.page .login {
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

		.page text {
			font-size: 30rpx;
			height: 42rpx;
			color: #666666;
		}
	}
</style>
