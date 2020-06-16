<template>

	<view class="search-page">
		<form @submit="submit" report-submit="false">
			<view class="top-search">
				<input type="text" :value="keywords" @input="bindSearchInputing" @confirm="search" confirm-type="搜索" :focus="focus"
				 placeholder="请输入菜谱、食材" placeholder-class="phcolor"></input>
				<image class="search-icon" src="/static/images/search-pic.png"></image>
				<image class="delete-icon" v-if="keywords.length" src="/static/images/close.png" @click="clearKeyWord">
					<button @click="goSearch(keywords)" size="mini" plain="true" hover-class="click-style" hover-stay-time="100">搜索</button>
				</image>
			</view>
		</form>

		<!--搜索列表-->
		<view class="result-con" v-if="keywords.length">
			<form @submit="submit" report-submit="false">
				<!--没有搜索结果-->
				<view v-if="noSearchResult">
					<image class="no-content" src="/static/images/empty-pic.png"></image>
					<view class="no-content-text">暂无相关内容</view>
				</view>
				<view v-for="(item, index) in list" :key="index">
					<view v-if="item.isDish == 2">
						<searchItem :item="item" @click="navTo('/pages/recipeDetail?dishCode=' + item.code)"></searchItem>
					</view>
				</view>
				<!--加载更多时动画-->
				<bottomLoadMore :show="!showBottomText"></bottomLoadMore>
				<!--默认text-->
				<bottomText :show="showBottomText"></bottomText>
			</form>
		</view>
		<!--最近搜索、热门搜索-->
		<view class="enter" v-else>
			<view class="content hot-content">
				<view class="title">热门搜索:</view>
				<view class="con" v-for="(item, index) in hotword" :key="index" @click.stop="goSearch(item)">
					<text class="ellipsis">{{item}}</text>
				</view>
			</view>
			<view class="content recent recent-content" v-if="recentSearch.length">
				<view class="title">历史搜索:</view>
				<image @click="deleteSearch" class="delete-search" src="/static/images/delete.png"></image>
				<view class="con" v-for="(item, index) in recentSearch" :key="index" @click.stop="goSearch(item)">
					<text class="ellipsis">{{item}}</text>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		request
	} from '@/utils/request.js';
	import utils from '@/utils/util';
	import tip from '@/utils/tip';
	import BottomLoadMore from '@/components/common/bottomLoadMore';
	import BottomText from '@/components/common/bottomText';
	import searchItem from '@/components/common/searchItem.vue';

	export default {
		data() {
			return {
				focus: false,
				list: [],
				// 搜索结果
				recentSearch: [],
				// 搜索记录
				hotword: [],
				// 热门搜索
				noSearchResult: false,
				// 没有搜索结果
				keywords: '',
				// 搜索关键字
				page: 1,
				// 是否有更多
				showBottomText: false,
				//是否展示text
				isFisrt: true,
				isFocus: false // 是否在输入状态
			};
		},
		components: {
			BottomLoadMore,
			BottomText,
			searchItem
		},

		onLoad(options) {
			let that = this;
			that.keywords = options.code;
			that.focus = that.keywords ? false : true;
			that.search();
			that.getModel();
			uni.setNavigationBarTitle({
				title: that.keywords || '香哈菜谱'
			});
			if (uni.getStorageSync('recentSearch')) {
				this.recentSearch = uni.getStorageSync('recentSearch');
			}
		},

		onReachBottom() {
			let that = this;
			if (this.showBottomText) return false;
			that.search();
		},



		methods: {
			getModel() {
				var that = this;
				request('/baidu/v1/search/hotWords').then(res => {
					if (res.code == 10000) {
						this.hotword = res.data;
					}
				});
			},

			search(arg) {
				let that = this;

				if (!that.keywords) {
					return;
				}
				if (!that.isFisrt) {
					that.page++;
				}
				var params = {
					keywords: that.keywords,
					page: that.page
				};
				request('/baidu/v1/search/soCaipu', params).then(res => {
					if (res.code == 10000 && res.data && res.data[0]) {
						that.noSearchResult = false;
						that.list = [...that.list, ...res.data];
						that.isFisrt = false;
						that.showBottomText = res.isEnd == 1 ? false : true;
						//删除重复关键词
						if (this.recentSearch.indexOf(this.keywords) > -1) {
							this.recentSearch.splice(this.recentSearch.indexOf(this.keywords), 1);
						}
						that.recentSearch.unshift(that.keywords);
						uni.setStorageSync('recentSearch', that.recentSearch);
					} else {
						that.noSearchResult = true;
					}
				});
			},

			// 页面跳转
			navTo(url) {
				utils.xhNavigateTo(url);
			},


			bindSearchInputing(e) {
				this.showLoading = false;
				this.isFocus = true;
				this.keywords = e.detail.value;
				this.list = [];
			},

			deleteSearch(e) {
				this.recentSearch = [];
				uni.setStorageSync('recentSearch', '');
			},

			// 清空搜索
			clearKeyWord(e) {
				this.page = 1;
				this.keywords = '';
				this.list = [];
			},



			// 发起搜索
			goSearch(params, type) {
				uni.setNavigationBarTitle({
					title: params || '香哈菜谱'
				});
				this.focus = false;
				this.isFocus = false;
				this.page = 1;
				this.isFisrt = true;
				this.noSearchResult = false;
				this.list = [];
				this.showBottomText = false;

				switch (type) {
					case '1':
						this.keywords += ' ' + params;
						this.search();
						break;

					case '2':
						this.keywords = params;
						this.search();
						break;

					case '3':
						this.keywords = params;
						this.search();
						break;

					case '4':
						this.keywords = params;
						this.search();
						break;

					default:
						this.keywords = params;
						this.search();
				}
			},
		},
	};
</script>
<style lang="less">
	.search-page {
		padding-top: 90rpx;
	}

	.top-search {
		background: #efeff4;
		height: 90rpx;
		width: 100%;
		box-sizing: border-box;
		padding: 14rpx 30rpx;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 500;
	}

	.top-search button {
		position: absolute;
		right: 20rpx;
		top: 0rpx;
		height: 90rpx;
		line-height: 90rpx;
		border: none;
		color: #e02000;
		font-size: 32rpx;
		padding: 0;
	}

	.top-search .click-style {
		filter: alpha(opacity=50);
		-moz-opacity: 0.5;
		-khtml-opacity: 0.5;
		opacity: 0.5;
	}

	.top-search view {
		color: #e85b09;
		font-size: 35rpx;
		line-height: 58rpx;
		padding-left: 19rpx;
	}

	.top-search image {
		position: absolute;
		width: 26rpx;
		height: 26rpx;
		left: 33rpx;
		top: 31rpx;
		z-index: 10;
	}

	.top-search input {
		background: #fff;
		border: 1rpx solid #e6e6ea;
		border-radius: 5px;
		box-sizing: border-box;
		width: 610rpx;
		height: 100%;
		padding-left: 68rpx;
		padding-right: 50rpx;
		font-size: 28rpx;
		color: #000;
	}

	.phcolor {
		color: #cccccc;
	}

	/*清除关键词的样式*/
	.clear-text {
		visibility: hidden;
	}

	/*输入关键词的样式*/
	.input-text {
		color: #999;
		font-size: 26rpx;
		padding-top: 2rpx;
	}

	.top-search .delete-icon {
		position: absolute;
		width: 20rpx;
		height: 20rpx;
		left: 582rpx;
		top: 24rpx;
		z-index: 1000;
		padding: 9rpx;
	}

	.top-search .search-icon {
		position: absolute;
		left: 61rpx;
		top: 32rpx;
		width: 26rpx;
		height: 26rpx;
		z-index: 100;
	}

	.content {
		height: auto;
		padding: 0 30rpx 0;
	}

	.hot-content {
		overflow: hidden;
		padding-top: 34rpx;
	}

	.recent-content {
		padding-top: 38rpx;
	}

	.content .title {
		font-size: 30rpx;
		color: #999999;
		margin-bottom: 5rpx;
	}

	.content .con {
		box-sizing: border-box;
		display: inline-block;
		line-height: 34rpx;
		box-sizing: border-box;
		border: 0.5px solid #d3d3d3;
		border-radius: 18px;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		padding: 11rpx 26rpx 10rpx;
		margin-right: 18rpx;
		margin-top: 18rpx;
		max-width: 100%;
	}

	.recent {
		position: relative;
	}

	.content .delete-search {
		display: block;
		width: 26rpx;
		height: 30rpx;
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}

	.no-content {
		display: block;
		width: 103rpx;
		height: 103rpx;
		margin: 0 auto;
		margin-top: 200rpx;
		position: relative;
		left: -15rpx;
	}

	.no-content-text {
		text-align: center;
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #bbbbbb;
		position: relative;
		left: -15rpx;
	}

	.relate-tag-wrap {
		background-color: #fff;
		position: fixed;
		top: 90rpx;
		width: 100%;
		z-index: 500;
	}

	.relate-tag {
		box-sizing: border-box;
		height: 86rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #e5e5e5;
		padding: 17rpx 20rpx 17rpx 0rpx;
		white-space: nowrap;
		overflow-x: scroll;

		.tag {
			display: inline-block;
			padding: 7rpx 25rpx 7rpx 25rpx;
			background: #f1f1f1;
			border-radius: 2px;
			margin-left: 20rpx;
			font-size: 26rpx;
		}

		.tag-last {
			margin-right: 60rpx;
		}
	}

	.change {
		position: absolute;
		right: 0;
		top: 0;
		width: 25rpx;
		height: 28rpx;
		padding: 27rpx 20rpx;
		background-image: linear-gradient(90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 1) 10%,
			rgba(255, 255, 255, 1) 100%,
			);
	}
</style>
