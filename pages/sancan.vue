<template>

	<!--头部tab分页-->
	<view class="page">
		<searchBar></searchBar>
		<scroll-view class="switch-nav" scroll-x scroll-with-animation :scroll-left="scrollLeft">
			<view scroll-x class="wrapper">
				<view v-for="(item, index) in tabList" :key="index" @click="changeTab(item.key + '')" class="tab-item">
					<view :class="(activeIndex == item.key ? 'active':'') + ' item-one'"> {{item.text}}</view>
				</view>
			</view>
		</scroll-view>
		<swiper style="height:100%;width:100%" :current="activeIndex" @change="swiperTab">
			<swiper-item v-for="($item, $index) in list" :key="$index">
				<scroll-view scroll-y class="swiper-scroll" @scrolltolower="more">
					<block v-for="(item, index) in $item" :key="index">
						<Card :item="item"></Card>
					</block>
					<view class="bot-box">
						<!--加载更多时动画-->
						<bottomLoadMore :show.sync="showLoading"></bottomLoadMore>
						<!--默认text-->
						<bottomText :show.sync="showBottomText"></bottomText>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

	</view>

</template>

<script>
	import tip from "@/utils/tip";
	import utils from "@/utils/util";
	import {
		request
	} from '@/utils/request.js';
	import SearchBar from "@/components/search/searchBar.vue";
	import BottomLoadMore from "@/components/common/bottomLoadMore";
	import BottomText from "@/components/common/bottomText";
	import Card from "@/components/common/card.vue";

	export default {
		data() {
			return {
				isOk: true,
				// 避免多次请求
				activeIndex: 0,
				// 默认选中
				showLoading: false,
				showBottomText: false,
				// 显示底部语
				tabList: [{
					key: "0",
					text: "早餐"
				}, {
					key: "1",
					text: "午餐"
				}, {
					key: "2",
					text: "晚餐"
				}],
				list: [],
				isFisrt: true,
				// 是否首次
				twoType: 0,
				//  类型 1:早餐 2:午餐 3:晚餐
				pages: {
					page0: 1,
					page1: 1,
					page2: 1
				},
			};
		},

		onLoad(options) {
			let that = this;

			if (options.acIndex) {
				// 存在直接三餐位置
				that.activeIndex = options.acIndex;
				that.twoType = options.acIndex;
			} else {
				// 不存在
				// 初始化三餐选中位置
				let hour = new Date().getHours();

				if (hour >= 10 && hour < 14) {
					that.activeIndex = 1;
					that.twoType = 1;
				} else if (hour >= 14 && hour < 22) {
					that.activeIndex = 2;
					that.twoType = 2;
				}
			}
			that.getList();
		},

		components: {
			searchBar: SearchBar,
			bottomLoadMore: BottomLoadMore,
			bottomText: BottomText,
			Card: Card
		},
		props: {},
		methods: {
			getList(type) {
				let that = this;
				let pg = `page${that.activeIndex}`;
				let params = {};

				if (!that.isFisrt) {
					params.twoType = that.activeIndex + 1;
					that.pages[pg]++;
					params.page = that.pages[pg];
				} else {
					params.page = that.pages[pg];
				}
				that.showLoading = true;
				if (that.isFisrt) {
					tip.loading();
				}
				request("/v1/Index/sancan", params).then(res => {
					tip.loaded();
					if (res.code == 10000) {
						if (that.isFisrt) {
							that.list = res.data.data;
						} else {
							let i = that.twoType;
							that.list[i].push(...res.data.data[0]);
							that.isOk = true;
						}
						if (res.isEnd == 2) {
							this.showBottomText = true;
						} else {
							this.showBottomText = false;
						}
						that.isFisrt = false;
					}
				});
			},

			// 页面跳转
			navTo(url) {
				utils.xhNavigateTo(url);
			},

			changeTab(index) {
				this.activeIndex = index;
				this.twoType = index;
				this.isOk = true;
				this.showBottomText = false;
			},

			swiperTab(e) {
				var index = e.detail.current;
				this.activeIndex = index;
				this.twoType = index;
				this.isOk = true;
				this.showBottomText = false;
			},

			more() {
				let that = this;
				if (!that.isOk) {
					return;
				}
				that.isOk = false;
				that.getList(that.twoType);
			},

		},
	};
</script>
<style lang="less">
	.page {
		width: 100%;
		height: 100vh;

		.switch-nav {
			position: fixed;
			width: 100%;
			top: 104rpx;
			z-index: 20;
			box-sizing: border-box;
			background: #f6f6f6;

			.wrapper {
				display: flex;
				white-space: nowrap;
				height: 90rpx;

				.tab-item {
					width: 33.3%;
					height: 88rpx;
					line-height: 88rpx;
					text-align: center;

					.item-one {
						width: 80rpx;
						height: 84rpx;
						margin: 0 auto;
						color: #a6a6a6;
						font-size: 31rpx;

						&.active {
							border-bottom: 2px solid #f23030;
							color: #f23030;
						}
					}
				}
			}
		}

		.swiper-scroll {
			box-sizing: border-box;
			height: 100vh;
			width: 100%;
			padding-top: 194rpx;
		}
	}
</style>
