<template>

	<view class="menu-page">
		<searchBar></searchBar>
		<view class="con">
			<text class="title-1">{{model.title}}</text>
			<text class="intro">{{model.info}}</text>
			<block v-for="item in list" :key="item">
				<card :item="item"></card>
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
	import BottomLoadMore from "@/components/common/bottomLoadMore";
	import BottomText from "@/components/common/bottomText";
	import searchItem from '@/components/common/searchItem.vue';
	import searchBar from '@/components/search/searchBar.vue';
	import Card from '@/components/common/card.vue';

	export default {
		data() {
			return {
				page: 0,
				code: "",
				// code参数
				userInfo: "",
				// 用户信息
				showBottomText: false,
				// 显示底部语
				list: [],
				model: {},
				// 内容
			};
		},

		onLoad(options) {
			// 页面初始化 options为页面跳转所带来的参数
			var that = this;
			tip.loading();
			that.code = options.code;
			that.userInfo = this.$store.state.userInfo;
			that.getList();
		},

		onReachBottom() {
			let that = this;
			if(that.showBottomText) return;
			that.getList();
			
		},

		components: {
			BottomLoadMore,
			BottomText,
			searchItem,
			searchBar,
			Card
		},
		methods: {
			getList() {
				let that = this;
				that.page++;
				let params = {
					page: that.page,
					code: that.code
				};
				request("/v1/Index/TopicInfo", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.model = res.data.data;
						that.list = [...that.list, ...res.data.data.dishList];
						that.showBottomText = res.data.isEnd == 1 ? false : true;
						tip.loaded();
					} else {
						tip.error("内部参数错误");
					}
				});
			},

			// 收藏
			setLike() {
				let that = this;
				if (!that.userInfo.code) {
					tip.openConfirm({
						title: "温馨提示",
						con: "请先前往[我的]页面登录",
						okCbFn: () => {
							uni.switchTab({
								url: "/pages/user"
							});
						}
					});
					return;
				}
				let params = {
					code: that.code,
					type: 2
				};
				request("/v1/Favorites/editFavorites", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.model.isFavorites = res.data.status;
						if (res.data.status == 2) {
							tip.toast("收藏成功");
						} else {
							tip.toast("取消成功");
						}
					} else {
						tip.alert(res.msg);
					}
				});
			},
		},
	};
</script>
<style lang="less">
	.menu-page {
		// height: 100vh;
		padding-top: 100rpx;

		.con {
			padding: 0 40rpx 110rpx 40rpx;
			// margin-bottom: 140rpx;
			box-sizing: border-box;

			.title-1 {
				display: block;
				width: 100%;
				text-align: center;
				margin-top: 38rpx;
				font-size: 46rpx;
				line-height: 66rpx;
				color: #444444;
				font-weight: 700;
			}

			.intro {
				display: block;
				margin-top: 34rpx;
				line-height: 46rpx;
				font-size: 32rpx;
				color: #606060;
			}

			.xh-text {
				width: 40%;
			}
		}
	}
</style>
