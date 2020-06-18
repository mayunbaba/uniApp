<template>

	<!-- 分类page -->
	<view class="classify-box">
		<searchBar></searchBar>
		<!-- 左侧分类 -->
		<view class="left-tabbar">
			<scroll-view scroll-y class="left-tabbar-list">
				<view @click="changeTab(index)" :class="'left-tabbar-item ' + (activeIndex==index?'active':'')" v-for="(item, index) in list"
				 :key="index">{{item.name}}</view>
			</scroll-view>
		</view>
		<view class="right-content">
			<scroll-view scroll-y="true" class="tab-panel">
				<block v-if="contentList.tags.length==1">
					<view class="por pt40" v-for="(item, index) in contentList.tags" :key="index">
						<view @click="navTo('/pages/search?code=' + item.name)" v-for="(item, index) in item.data" :key="index" class="item-one ellipsis">
							<text>{{item.name}}</text>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="por" v-for="(item, index) in contentList.tags" :key="index">
						<view class="por tag-name"><text class="bg-line center"></text><text class="item-name center">{{item.name}}</text></view>
						<view>
							<view class="item-one" @click="navTo('/pages/search?code=' + item.name)" v-for="(item, index) in item.data" :key="index">
								<text>{{item.name}}</text>
							</view>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<custom-tab-bar></custom-tab-bar>
	</view>

</template>

<script>
	import utils from "@/utils/util";
	import SearchBar from "@/components/search/searchBar.vue";
	import {
		request
	} from '@/utils/request.js';

	export default {
		data() {
			return {
				activeIndex: 0,
				// 当前选中
				list: [],
				contentList: [],
			};
		},
		onLoad() {
			this.getList();
		},
		components: {
			searchBar: SearchBar,
		},
		props: {},
		methods: {
			getList() {
				let that = this;
				request("/baidu/v1/Index/getFenleiData").then(res => {
					if (res.code == 10000) {
						that.list = res.data;
						that.contentList = that.list[0];
					}
				});
			},

			// 页面跳转
			navTo(url) {
				utils.xhNavigateTo(url);
			},

			changeTab(index) {
				this.activeIndex = index;
				this.contentList = this.list[index];
			},
		},
	};
</script>
<style lang="less">
	.classify-box {
		box-sizing: border-box;
		width: 100%;
		height: calc(100vh - 48px);
		display: flex;
		padding-top: 104rpx;
		overflow: hidden;

		.left-tabbar {
			width: 22%;

			.left-tabbar-list {
				height: 100%;
				background: #eee;

				.left-tabbar-item {
					color: #4c4c4c;
					font-size: 28rpx;
					width: 100%;
					padding: 26rpx 0;
					text-align: center;

					&.active {
						background: #fff;
						color: #f23030;
						border-left: 8rpx solid rgb(228, 56, 56);
						border-bottom: 1rpx solid #fff;
						// transition: all 0.5s;
						// animation: show 0.5s;
					}
				}
			}
		}

		.right-content {
			width: 78%;

			.tab-panel {
				height: 100%;
				padding: 0 30rpx;
				box-sizing: border-box;
				font-size: 28rpx;
				color: #dfdfdf;

				.item-one {
					float: left;
					width: 30%;
					line-height: 32rpx;
					padding: 13rpx 0 14rpx;
					box-sizing: border-box;
					margin-bottom: 32rpx;
					text-align: center;
					border-radius: 80rpx;
					border: 1rpx solid #dfdfdf;
					margin-right: 4%;
					color: #999999;
					font-size: 28rpx;

					&:nth-child(3n) {
						margin-right: 0;
					}
				}

				.tag-name {
					width: 100%;
					margin: 0 auto;
					color: #941c1c;
					text-align: center;
					padding: 62rpx 40rpx 72rpx;
					box-sizing: border-box;

					.bg-line {
						width: 100%;
						height: 1rpx;
						background: #e3e3e3;
					}

					.item-name {
						padding: 0 20rpx;
						background: #ffffff;
						height: 40rpx;
						line-height: 40rpx;
					}
				}
			}
		}
	}

	@-webkit-keyframes show {
		0% {
			opacity: 0;
			transform: rotateY(180deg);
		}

		100% {
			opacity: 1;
			transform: rotateY(360deg);
		}
	}

	@keyframes show {
		0% {
			opacity: 0;
			transform: rotateY(180deg);
		}

		100% {
			opacity: 1;
			transform: rotateY(360deg);
		}
	}

	.center {
		text-align: center;
		position: absolute;
		left: 50%;
		top: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.por {
		position: relative;
		overflow: hidden;
	}

	.pt40 {
		padding-top: 40rpx;
	}
</style>
