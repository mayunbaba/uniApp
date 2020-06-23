<template>

	<!-- 视频菜谱 -->
	<view class="page">
		<searchBar></searchBar>
		<scroll-view class="switch-nav" scroll-x="true" scroll-left="120">
			<view class="wrapper">
				<view :class="(activeIndex == item.key ? 'active':'') + ' item-tab'" v-for="(item, index) in tabList" :key="index"
				 @click="changeTab(item.key, item.twoType )">
					{{item.title}}
				</view>
			</view>
		</scroll-view>
		<view class="swiper-scroll">
			<block v-for="item in conList" :key="item">
				<Card :item="item"></Card>
			</block>
			<!--加载更多时动画-->
			<bottomLoadMore :show="!showBottomText"></bottomLoadMore>
			<!--默认text-->
			<bottomText :show="showBottomText"></bottomText>
		</view>
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
		components: {
			searchBar: SearchBar,
			bottomLoadMore: BottomLoadMore,
			bottomText: BottomText,
			Card: Card
		},
		data() {
			return {
				showBottomText: false,
				// 显示底部语
				activeIndex: 0,
				tabList: [],
				// tab
				conList: [],
				//con
				page: 0,
				//page
				twoType: "",
			};
		},

		onLoad() {
			let that = this;
			tip.loading();
			that.getTabList();
		},

		onReachBottom() {
			let that = this;
			that.getConList();
		},

		methods: {
			getTabList() {
				let that = this;
				request("/v1/Index/getVideoTab").then(res => {
					if (res.code == 10000) {
						that.tabList = res.data;
						that.twoType = res.data[0].twoType;
						that.getConList();
					}
				});
			},

			getConList() {
				let that = this;
				if (that.showBottomText) return;
				that.page++;
				let params = {
					twoType: that.twoType,
					page: that.page
				};
				request("/v1/Index/video", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.page++;
						that.conList = [...that.conList, ...res.data];
						that.showBottomText = res.isEnd == 1 ? false : true;
						tip.loaded();
					} else {
						tip.error("数据问题");
					}
				});
			},

			changeTab(index, twoType) {
				this.twoType = twoType;
				this.activeIndex = index;
				this.showBottomText = false;
				this.page = 0;
				this.conList = [];
				tip.loading();
				this.getConList();
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
			top: 100rpx;
			z-index: 20;
			background: #ffffff;
			white-space: nowrap;

			.wrapper {
				display: flex;
				justify-content: space-between;
				padding: 22rpx 0 16rpx 40rpx;

				.item-tab {
					display: inline-block;
					padding: 0 26rpx;
					// width: 118rpx;
					height: 50rpx;
					line-height: 50rpx;
					// margin-top: 16rpx;
					text-align: center;
					font-size: 28rpx;
					color: #999999;

					&.active {
						color: #333333;
						background: #f0f0f0;
						border-radius: 36rpx;
					}
				}
			}
		}

		.swiper-scroll {
			height: 1005rpx;
			width: 100%;
			padding-top: 158rpx;

		}
	}
</style>
